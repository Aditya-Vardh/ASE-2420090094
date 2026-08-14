import type { ArchitectureGraph, DetailedHealthScore } from "../graph/types";

export function evaluateArchitectureScore(graph: ArchitectureGraph): DetailedHealthScore {
  const nodes = graph.nodes;
  const edges = graph.edges;

  if (!nodes || nodes.length === 0) {
    return {
      overall: 80,
      label: "Good",
      scalability: { score: 80, reason: "Baseline architecture configuration." },
      reliability: { score: 80, reason: "Standard single-tier component reliability." },
      security: { score: 85, reason: "Basic TLS and gateway authentication." },
      performance: { score: 82, reason: "Direct HTTP routing." },
      maintainability: { score: 84, reason: "Modular component boundaries." },
      resilience: { score: 78, reason: "Standard failover policies." },
      coupling: { score: 82, reason: "Decoupled component architecture." },
      complexity: { score: 80, reason: "Manageable component count." },
      availability: { score: 85, reason: "Single region ingress gateway." },
      costTier: "MEDIUM",
      costDrivers: ["Standard compute nodes", "Relational database instance"],
    };
  }

  const hasCache = nodes.some((n) => n.type === "cache");
  const hasQueue = nodes.some((n) => n.type === "queue");
  const hasGateway = nodes.some((n) => n.type === "gateway");
  const hasAuth = nodes.some((n) => n.type === "auth");
  const dbNodes = nodes.filter((n) => n.type === "database");

  // Fan-in count per node
  const fanInMap = new Map<string, number>();
  edges.forEach((e) => {
    fanInMap.set(e.targetId, (fanInMap.get(e.targetId) || 0) + 1);
  });

  // Calculate Scalability (Base 70)
  let scaleScore = 72;
  if (hasCache) scaleScore += 12;
  if (hasQueue) scaleScore += 10;
  if (hasGateway) scaleScore += 6;
  const scaleReason = hasCache && hasQueue
    ? "In-memory caching and asynchronous message queues isolate database load during traffic spikes."
    : hasCache
    ? "Redis caching reduces database read queries, but asynchronous background queues would improve peak write handling."
    : "Direct database persistence without in-memory caching poses bottleneck risks under heavy read traffic.";

  // Calculate Reliability (Base 70)
  let relScore = 74;
  let spofCount = 0;
  dbNodes.forEach((db) => {
    if ((fanInMap.get(db.id) || 0) >= 3 && !hasCache) {
      spofCount++;
      relScore -= 10;
    }
  });
  if (hasQueue) relScore += 8;
  if (hasGateway) relScore += 5;
  const relReason = spofCount > 0
    ? `Database component (${dbNodes[0]?.name || "Main DB"}) receives direct high fan-in traffic without a caching buffer.`
    : "Distributed components feature isolated retry domains and queue fallback protection.";

  // Calculate Security (Base 75)
  let secScore = 75;
  if (hasAuth) secScore += 12;
  if (hasGateway) secScore += 8;
  const secReason = hasAuth && hasGateway
    ? "Centralized API Gateway enforces strict token validation and rate limiting before routing traffic."
    : "API gateway handles entry routing, but dedicated OAuth2/JWT auth service would harden security posture.";

  // Calculate Performance (Base 72)
  let perfScore = 72;
  if (hasCache) perfScore += 14;
  if (!hasCache && dbNodes.length > 0) perfScore -= 6;
  const perfReason = hasCache
    ? "Sub-millisecond Redis cache reads minimize database disk I/O latency."
    : "Direct database queries add disk I/O latencies under concurrent user requests.";

  // Calculate Maintainability (Base 78)
  const maintainScore = Math.min(95, Math.max(65, 88 - Math.floor(nodes.length / 3)));
  const maintainReason = nodes.length <= 8
    ? "Clean, modular microservice boundaries with single responsibility domains."
    : "High component density requires automated distributed tracing and service registry management.";

  // Calculate Resilience (Base 75)
  const resilienceScore = Math.min(95, Math.round((scaleScore + relScore) / 2));
  const resilienceReason = resilienceScore >= 85
    ? "Decoupled asynchronous architecture prevents cascading service failures."
    : "Synchronous dependency chains may propagate upstream timeouts during service degradation.";

  // Coupling & Complexity
  const couplingScore = Math.min(94, Math.max(60, 90 - edges.length * 2));
  const complexityScore = Math.min(92, Math.max(65, 85 - nodes.length));

  // Availability
  const availScore = hasGateway && hasQueue ? 92 : hasGateway ? 86 : 78;

  // Overall Score
  const overall = Math.round(
    scaleScore * 0.25 +
    relScore * 0.25 +
    secScore * 0.2 +
    perfScore * 0.15 +
    maintainScore * 0.15
  );

  let label: DetailedHealthScore["label"] = "Excellent";
  if (overall < 65) label = "Critical";
  else if (overall < 78) label = "Needs Attention";
  else if (overall < 88) label = "Good";

  // Cost Evaluation
  let costTier: DetailedHealthScore["costTier"] = "MEDIUM";
  const costDrivers: string[] = [];

  if (nodes.length > 8 || (hasQueue && hasCache && dbNodes.length > 1)) {
    costTier = "HIGH";
    costDrivers.push("Multi-instance microservices cluster", "Distributed event bus infrastructure", "Managed database cluster");
  } else if (hasCache || hasQueue) {
    costTier = "MEDIUM";
    costDrivers.push("In-memory Redis instance", "Containerized application runtime");
  } else {
    costTier = "LOW";
    costDrivers.push("Monolithic / single-region database compute");
  }

  return {
    overall,
    label,
    scalability: { score: Math.min(98, scaleScore), reason: scaleReason },
    reliability: { score: Math.min(98, Math.max(50, relScore)), reason: relReason },
    security: { score: Math.min(98, secScore), reason: secReason },
    performance: { score: Math.min(98, perfScore), reason: perfReason },
    maintainability: { score: maintainScore, reason: maintainReason },
    resilience: { score: resilienceScore, reason: resilienceReason },
    coupling: { score: couplingScore, reason: "Inter-service dependencies use explicit protocol contracts." },
    complexity: { score: complexityScore, reason: "Graph depth maintains clear component hierarchy." },
    availability: { score: availScore, reason: "Stateless application instances scale behind ingress." },
    costTier,
    costDrivers,
  };
}
