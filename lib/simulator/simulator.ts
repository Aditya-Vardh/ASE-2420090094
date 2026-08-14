import type { ArchitectureGraph, SimulationScenario, SimulationResult } from "../graph/types";

export function simulateTrafficScenario(
  graph: ArchitectureGraph,
  scenario: SimulationScenario
): SimulationResult {
  const nodes = graph.nodes;
  const dbNodes = nodes.filter((n) => n.type === "database");
  const cacheNodes = nodes.filter((n) => n.type === "cache");
  const queueNodes = nodes.filter((n) => n.type === "queue");
  const gatewayNodes = nodes.filter((n) => n.type === "gateway");

  const bottleneckNodeIds: string[] = [];
  const overloadedDatabaseIds: string[] = [];
  const failureRisks: string[] = [];
  const recommendedAdditions: string[] = [];

  let latencyIncreaseMs = 5;
  let isViable = true;

  // Evaluate 1M+ users scenario
  if (scenario.users >= 1000000) {
    latencyIncreaseMs += 45;

    // Database bottleneck check
    if (dbNodes.length > 0 && cacheNodes.length === 0) {
      isViable = false;
      dbNodes.forEach((db) => {
        bottleneckNodeIds.push(db.id);
        overloadedDatabaseIds.push(db.id);
      });
      failureRisks.push(`Database connection pool exhaustion on ${dbNodes[0]?.name || "Main DB"} under ${scenario.users.toLocaleString()} users.`);
      recommendedAdditions.push("Deploy Redis cache cluster to offload read queries.");
    }

    // High traffic without queue
    if (scenario.requestRateRPS >= 50000 && queueNodes.length === 0) {
      failureRisks.push("Synchronous HTTP thread pool starvation under 50,000+ RPS burst traffic.");
      recommendedAdditions.push("Introduce Apache Kafka event bus for async order/notification queues.");
    }
  }

  // Evaluate 10M users scenario
  if (scenario.users >= 10000000) {
    latencyIncreaseMs += 120;
    if (gatewayNodes.length < 2) {
      gatewayNodes.forEach((gw) => bottleneckNodeIds.push(gw.id));
      failureRisks.push(`Single Ingress Gateway bandwidth saturation under 10M concurrent users.`);
      recommendedAdditions.push("Multi-region DNS load balancing with global CDN edge caching.");
    }
  }

  // Availability target check
  if (scenario.availabilityTarget === "99.99%" && scenario.regionCount < 2) {
    failureRisks.push("Single-region deployment cannot satisfy 99.99% SLA (max 52 mins downtime/year).");
    recommendedAdditions.push("Provision multi-region active-active database replication and failover DNS.");
  }

  let analysis = `At ${scenario.users.toLocaleString()} users (${scenario.requestRateRPS.toLocaleString()} RPS), `;
  if (isViable && failureRisks.length === 0) {
    analysis += "the architecture remains fully resilient with smooth sub-50ms latency distribution.";
  } else {
    analysis += `the architecture encounters critical bottlenecks on ${bottleneckNodeIds.length} component(s). Caching and multi-region replication are required.`;
  }

  return {
    scenario,
    isViable,
    bottleneckNodeIds: Array.from(new Set(bottleneckNodeIds)),
    overloadedDatabaseIds,
    latencyIncreaseMs,
    failureRisks,
    recommendedAdditions,
    analysis,
  };
}
