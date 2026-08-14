import type { ArchitectureGraph } from "@/lib/graph/types";
import type { CostAnalysisResult } from "./types";

export function analyzeCostIntelligence(graph: ArchitectureGraph): CostAnalysisResult[] {
  const nodes = graph.nodes;
  if (!nodes || nodes.length === 0) {
    return [
      {
        costTier: "LOW",
        primaryDrivers: ["Baseline single-container runtime"],
        recommendations: ["Maintain monolithic single-region deployment for early-stage prototype."],
        tradeoffExplanation: "Low cost expenditure, but limited scalability during heavy traffic surges.",
      },
    ];
  }

  const dbNodes = nodes.filter((n) => n.type === "database");
  const cacheNodes = nodes.filter((n) => n.type === "cache");
  const queueNodes = nodes.filter((n) => n.type === "queue");
  const serviceNodes = nodes.filter((n) => n.type === "microservice");

  const primaryDrivers: string[] = [];
  let costTier: CostAnalysisResult["costTier"] = "LOW";

  if (serviceNodes.length >= 5 || (queueNodes.length > 0 && cacheNodes.length > 0 && dbNodes.length >= 2)) {
    costTier = "VERY HIGH";
    primaryDrivers.push(
      `${serviceNodes.length} Microservices container cluster`,
      "Managed Kafka / Event Bus broker cluster",
      "Multi-instance Redis Sentinel cache cluster",
      `Managed PostgreSQL database cluster (${dbNodes.length} DBs)`
    );
  } else if (serviceNodes.length >= 3 || queueNodes.length > 0 || cacheNodes.length > 0) {
    costTier = "HIGH";
    primaryDrivers.push(
      "Distributed microservices container cluster",
      cacheNodes.length > 0 ? "In-memory Redis cache instance" : "Relational database compute",
      queueNodes.length > 0 ? "Managed event message queue" : "Ingress load balancer"
    );
  } else if (nodes.length > 3) {
    costTier = "MEDIUM";
    primaryDrivers.push("Application compute instance", "Managed relational database instance");
  } else {
    costTier = "LOW";
    primaryDrivers.push("Single container app host", "Standard database instance");
  }

  const recommendations: string[] = [];
  if (costTier === "VERY HIGH" || costTier === "HIGH") {
    recommendations.push("Consolidate low-volume microservices into a modular monolith to reduce cloud compute overhead.");
    if (queueNodes.length > 0) {
      recommendations.push("Use lightweight RabbitMQ or AWS SQS instead of multi-broker Kafka cluster for standard message workloads.");
    }
  } else {
    recommendations.push("Current infrastructure maintains lean cost profile with minimal cloud resource overhead.");
  }

  return [
    {
      costTier,
      primaryDrivers,
      recommendations,
      tradeoffExplanation: costTier === "VERY HIGH" || costTier === "HIGH"
        ? "High infrastructure compute expenditure guarantees high availability and zero-downtime scaling, but increases monthly cloud operational budget."
        : "Lean cost expenditure maintains low cloud billing, but high traffic bursts may require on-demand autoscaling provision.",
    },
  ];
}
