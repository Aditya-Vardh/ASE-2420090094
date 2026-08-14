import type { ArchitectureGraph, RiskIssue } from "../graph/types";

export function analyzeArchitectureRisks(graph: ArchitectureGraph): RiskIssue[] {
  const risks: RiskIssue[] = [];
  const nodes = graph.nodes;
  const edges = graph.edges;

  if (!nodes || nodes.length === 0) return risks;

  const dbNodes = nodes.filter((n) => n.type === "database");
  const cacheNodes = nodes.filter((n) => n.type === "cache");
  const queueNodes = nodes.filter((n) => n.type === "queue");
  const authNodes = nodes.filter((n) => n.type === "auth");
  const gatewayNodes = nodes.filter((n) => n.type === "gateway");

  // Fan-in mapping
  const fanInMap = new Map<string, string[]>();
  edges.forEach((e) => {
    const arr = fanInMap.get(e.targetId) || [];
    arr.push(e.sourceId);
    fanInMap.set(e.targetId, arr);
  });

  // 1. Single Point of Failure: Database Bottleneck without Cache
  dbNodes.forEach((db) => {
    const callers = fanInMap.get(db.id) || [];
    if (callers.length >= 2 && cacheNodes.length === 0) {
      risks.push({
        id: `risk-db-bottleneck-${db.id}`,
        title: `Database Read Bottleneck on ${db.name}`,
        severity: "CRITICAL",
        category: "scalability",
        description: `${db.name} receives direct queries from ${callers.length} upstream services without an in-memory caching layer.`,
        affectedNodeIds: [db.id, ...callers],
        whyItMatters: "Direct database disk I/O under high traffic spikes creates long query queues and web server socket timeouts.",
        potentialImpact: "Database connection pool exhaustion leading to widespread 504 Gateway Timeouts.",
        recommendedSolution: "Introduce Redis cache cluster to store frequent read queries with cache-aside strategy.",
      });
    }
  });

  // 2. Missing Centralized API Gateway
  if (gatewayNodes.length === 0) {
    const frontendNodes = nodes.filter((n) => n.type === "frontend");
    const serviceNodes = nodes.filter((n) => n.type === "microservice");
    risks.push({
      id: "risk-missing-gateway",
      title: "Missing API Gateway Ingress Router",
      severity: "HIGH",
      category: "security",
      description: "Clients directly query microservices without a centralized ingress gateway.",
      affectedNodeIds: [...frontendNodes.map((f) => f.id), ...serviceNodes.slice(0, 2).map((s) => s.id)],
      whyItMatters: "Exposing microservices directly increases attack surface area and duplicates CORS, authentication, and rate limiting logic across every service.",
      potentialImpact: "Inconsistent security enforcement, rate limit bypasses, and difficult API versioning.",
      recommendedSolution: "Deploy an API Gateway (e.g. Traefik, Kong, or Next.js Middleware Router) to centralize ingress auth and rate limiting.",
    });
  }

  // 3. Missing Dedicated Auth & Identity Service
  if (authNodes.length === 0) {
    risks.push({
      id: "risk-missing-auth",
      title: "Missing Centralized Auth & Identity Vault",
      severity: "HIGH",
      category: "security",
      description: "Architecture lacks a dedicated identity management service for issuing and verifying security tokens.",
      affectedNodeIds: nodes.filter((n) => n.type === "gateway" || n.type === "frontend").map((n) => n.id),
      whyItMatters: "Without a centralized OAuth2/JWT token vault, user credentials and permissions may be validated inconsistently.",
      potentialImpact: "Potential privilege escalation and token hijacking risks across microservices.",
      recommendedSolution: "Add a dedicated Auth Service (e.g., Keycloak or OAuth2 JWT Issuing Vault) at ingress tier.",
    });
  }

  // 4. Synchronous Dependency Chains Without Asynchronous Message Bus
  const syncEdges = edges.filter((e) => e.isSync);
  if (syncEdges.length > 5 && queueNodes.length === 0) {
    risks.push({
      id: "risk-sync-coupling",
      title: "Tight Synchronous Coupling Across Microservices",
      severity: "MEDIUM",
      category: "reliability",
      description: "Services communicate via direct synchronous HTTP calls without an asynchronous event message queue.",
      affectedNodeIds: nodes.filter((n) => n.type === "microservice" || n.type === "worker").map((n) => n.id),
      whyItMatters: "If a downstream microservice slows down or crashes, HTTP request queues back up, propagating failures across the entire cluster.",
      potentialImpact: "Cascading failures and increased end-to-end request latency.",
      recommendedSolution: "Introduce Apache Kafka or RabbitMQ event bus for decoupled background processing.",
    });
  }

  // 5. Unbuffered Background Processing (Missing Worker or Queue)
  const heavyNodes = nodes.filter((n) => n.name.toLowerCase().includes("imaging") || n.name.toLowerCase().includes("ota") || n.name.toLowerCase().includes("analytics") || n.name.toLowerCase().includes("ai"));
  heavyNodes.forEach((hn) => {
    if (queueNodes.length === 0) {
      risks.push({
        id: `risk-heavy-task-${hn.id}`,
        title: `Heavy Workload Execution on ${hn.name}`,
        severity: "MEDIUM",
        category: "performance",
        description: `${hn.name} performs CPU/GPU intensive computation synchronously.`,
        affectedNodeIds: [hn.id],
        whyItMatters: "Blocking request threads for heavy computation degrades user experience and depletes thread pool resources.",
        potentialImpact: "Elevated P99 response latencies and server thread starvation.",
        recommendedSolution: "Offload compute workload to background worker queues using Celery, BullMQ, or Kafka.",
      });
    }
  });

  return risks;
}
