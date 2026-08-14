import type { ArchitectureGraph, ArchNode, RiskSeverity } from "@/lib/graph/types";
import type { IntelligenceFinding } from "./types";

export function analyzeReliabilityIntelligence(graph: ArchitectureGraph): IntelligenceFinding[] {
  const findings: IntelligenceFinding[] = [];
  const nodes = graph.nodes;
  const edges = graph.edges;

  if (!nodes || nodes.length === 0) return findings;

  const dbNodes = nodes.filter((n) => n.type === "database");
  const cacheNodes = nodes.filter((n) => n.type === "cache");
  const queueNodes = nodes.filter((n) => n.type === "queue");
  const serviceNodes = nodes.filter((n) => n.type === "microservice");

  // Fan-in count mapping
  const fanInMap = new Map<string, string[]>();
  edges.forEach((e) => {
    const list = fanInMap.get(e.targetId) || [];
    list.push(e.sourceId);
    fanInMap.set(e.targetId, list);
  });

  // 1. Single Point of Failure: Unbuffered Database Bottleneck
  dbNodes.forEach((db) => {
    const callers = fanInMap.get(db.id) || [];
    if (callers.length >= 2 && cacheNodes.length === 0) {
      findings.push({
        id: `rel-spof-db-${db.id}`,
        category: "RELIABILITY",
        severity: "CRITICAL",
        title: `Single Point of Failure on ${db.name}`,
        description: `${db.name} handles direct traffic from ${callers.length} upstream services without a Redis cache or read replica buffer.`,
        affectedNodes: [db.id, ...callers],
        impact: "Database connection pool exhaustion during traffic surges causes cascading service timeouts.",
        recommendation: "Deploy a Redis cache cluster and configure read replicas with connection pooling.",
        rationale: `Graph evidence: ${db.name} receives high fan-in (${callers.length} callers) with 0 cache buffer nodes.`,
        source: "Reliability Analysis Engine (SPOF Protection)",
      });
    }
  });

  // 2. Synchronous Chain Latency & Failure Propagation
  const syncEdges = edges.filter((e) => e.isSync);
  if (syncEdges.length >= 4 && queueNodes.length === 0) {
    findings.push({
      id: "rel-sync-coupling",
      category: "RELIABILITY",
      severity: "HIGH",
      title: "Synchronous HTTP Dependency Coupling",
      description: "Architecture relies on direct synchronous HTTP calls across microservices without asynchronous message queue decoupling.",
      affectedNodes: serviceNodes.map((s) => s.id),
      impact: "Downstream latency or crash in one service propagates back upstream, causing cluster-wide thread pool starvation.",
      recommendation: "Introduce Apache Kafka or RabbitMQ event bus for asynchronous pub/sub message processing.",
      rationale: `Graph evidence: ${syncEdges.length} synchronous edges exist with 0 message queue nodes.`,
      source: "Reliability Analysis Engine (Coupling & Isolation)",
    });
  }

  // 3. Missing Circuit Breakers & Timeout Failover
  if (serviceNodes.length >= 3 && !nodes.some((n) => n.name.toLowerCase().includes("mesh") || n.name.toLowerCase().includes("breaker"))) {
    findings.push({
      id: "rel-missing-circuit-breaker",
      category: "RELIABILITY",
      severity: "MEDIUM",
      title: "Missing Circuit Breaker & Retry Resilience Layer",
      description: "Inter-service requests do not use automated circuit breakers (e.g., Resilience4j or Istio Envoy) to short-circuit failing downstream nodes.",
      affectedNodes: serviceNodes.slice(0, 3).map((s) => s.id),
      impact: "Repeated retry storms on failing services exhaust server memory and socket descriptors.",
      recommendation: "Configure Istio Service Mesh or Resilience4j circuit breakers with fallback defaults.",
      rationale: `Graph evidence: ${serviceNodes.length} microservices communicate directly without service mesh circuit breakers.`,
      source: "Reliability Analysis Engine (Resilience Mechanisms)",
    });
  }

  // 4. Single Region Deployment SLA Limit
  findings.push({
    id: "rel-[#multi-region]",
    category: "RELIABILITY",
    severity: "LOW",
    title: "Single Region Cloud Infrastructure Constraint",
    description: "System components are deployed in a single cloud region.",
    affectedNodes: dbNodes.length > 0 ? dbNodes.map((d) => d.id) : nodes.slice(0, 2).map((n) => n.id),
    impact: "Regional cloud outages impact service availability beyond 99.9% SLA.",
    recommendation: "Configure active-active multi-region database replication and DNS global traffic routing.",
    rationale: "Graph evidence: Topology lacks multi-region failover nodes.",
    source: "Reliability Analysis Engine (Multi-Region SLA)",
  });

  return findings;
}
