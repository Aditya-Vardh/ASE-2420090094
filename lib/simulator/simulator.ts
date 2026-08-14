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
  const serviceNodes = nodes.filter((n) => n.type === "microservice");

  const bottleneckNodeIds: string[] = [];
  const overloadedDatabaseIds: string[] = [];
  const failureRisks: string[] = [];
  const recommendedAdditions: string[] = [];

  let latencyIncreaseMs = 5;
  let isViable = true;

  // 1. Evaluate Concurrent Users & Regions Capacity
  // More regions provide extra horizontal capacity.
  const capacityPerRegion = 2000000; // 2M users per region
  const totalUserCapacity = scenario.regionCount * capacityPerRegion;

  if (scenario.users > totalUserCapacity) {
    isViable = false;
    const overloadRatio = scenario.users / totalUserCapacity;
    latencyIncreaseMs += Math.round(50 * overloadRatio);
    
    failureRisks.push(
      `Region capacity exceeded. ${scenario.regionCount} region(s) can support up to ${totalUserCapacity.toLocaleString()} concurrent users, but load is ${scenario.users.toLocaleString()}.`
    );
    recommendedAdditions.push("Deploy in more regions or add auto-scaling groups to prevent resource exhaustion.");
    
    // Nodes likely to fail
    if (gatewayNodes.length > 0) {
      gatewayNodes.forEach(g => bottleneckNodeIds.push(g.id));
    } else if (serviceNodes.length > 0) {
      serviceNodes.forEach(s => bottleneckNodeIds.push(s.id));
    }
  }

  // 2. Evaluate Database Read Bottleneck (Users & Cache dependency)
  if (scenario.users >= 1000000 && dbNodes.length > 0) {
    if (cacheNodes.length === 0) {
      isViable = false;
      dbNodes.forEach((db) => {
        bottleneckNodeIds.push(db.id);
        overloadedDatabaseIds.push(db.id);
      });
      latencyIncreaseMs += 80;
      failureRisks.push(`Database connection pool exhaustion on ${dbNodes[0]?.name || "Main Database"} under ${scenario.users.toLocaleString()} users without an in-memory cache.`);
      recommendedAdditions.push("Deploy a Redis cluster to cache high-frequency read queries.");
    } else {
      // Caching is present - check region sharding
      if (scenario.regionCount < 2 && scenario.users >= 5000000) {
        latencyIncreaseMs += 25;
        failureRisks.push("Single-region Redis cache is prone to hot-key bottlenecks under massive scale.");
        recommendedAdditions.push("Distribute cache clusters across multiple geographic regions.");
      }
    }
  }

  // 3. Evaluate Peak RPS & Queue Decoupling
  // Region count helps scale out stateless layers, but sync persistence remains a bottleneck
  const rpsThreshold = 20000 * scenario.regionCount;
  if (scenario.requestRateRPS >= rpsThreshold) {
    if (queueNodes.length === 0 && serviceNodes.length > 0) {
      isViable = false;
      serviceNodes.forEach(s => bottleneckNodeIds.push(s.id));
      latencyIncreaseMs += 110;
      failureRisks.push(`Synchronous HTTP thread pool starvation on microservices at ${scenario.requestRateRPS.toLocaleString()} RPS.`);
      recommendedAdditions.push("Introduce a message queue (e.g., Kafka / RabbitMQ) to process write events asynchronously.");
    }
  }

  // 4. Availability SLA vs Region Count & Ingress
  if (scenario.availabilityTarget === "99.99%" && scenario.regionCount < 2) {
    isViable = false;
    failureRisks.push("Single-region deployment cannot satisfy a 99.99% SLA (max 52 mins downtime/year).");
    recommendedAdditions.push("Set up a multi-region active-active deployment with geo-routing failover.");
  } else if (scenario.availabilityTarget === "99.999%") {
    if (scenario.regionCount < 3) {
      isViable = false;
      failureRisks.push("99.999% SLA requires active-active multi-region deployment across at least 3 regions (max 5 mins downtime/year).");
      recommendedAdditions.push("Deploy to 3+ active regions to survive dual-region cloud provider outages.");
    }
    if (gatewayNodes.length === 0) {
      isViable = false;
      failureRisks.push("99.999% SLA requires a dedicated high-availability entry API Gateway / Load Balancer.");
      recommendedAdditions.push("Introduce an Ingress API Gateway with global rate-limiting.");
    }
  }

  // Region count benefits: more regions lower average global network latency
  if (scenario.regionCount >= 3) {
    latencyIncreaseMs = Math.max(5, latencyIncreaseMs - 20);
  } else if (scenario.regionCount === 2) {
    latencyIncreaseMs = Math.max(5, latencyIncreaseMs - 10);
  }

  // Generate detailed dynamic analysis text based on specific issues detected
  let analysis = `Simulation of ${scenario.users.toLocaleString()} users at ${scenario.requestRateRPS.toLocaleString()} RPS across ${scenario.regionCount} region(s) with a target SLA of ${scenario.availabilityTarget}: `;
  
  if (failureRisks.length > 0) {
    const listText = failureRisks.map(r => `• ${r}`).join(" ");
    analysis += `Critical failure modes detected. Latency increased by +${latencyIncreaseMs}ms. ${listText}`;
  } else {
    analysis += `Architecture is fully viable. Load is distributed correctly. Dynamic latency penalty is kept at a minimal +${latencyIncreaseMs}ms.`;
  }

  // Double check viability constraint: if there are failure risks, the system CANNOT be viable.
  if (failureRisks.length > 0) {
    isViable = false;
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
