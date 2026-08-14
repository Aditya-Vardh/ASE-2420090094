import type { ArchitectureGraph } from "@/lib/graph/types";
import type { PatternDetectionResult } from "./types";

export function detectArchitecturePatterns(graph: ArchitectureGraph): PatternDetectionResult[] {
  const patterns: PatternDetectionResult[] = [];
  const nodes = graph.nodes;
  const edges = graph.edges;

  if (!nodes || nodes.length === 0) return patterns;

  const hasGateway = nodes.some((n) => n.type === "gateway");
  const hasCache = nodes.some((n) => n.type === "cache");
  const hasQueue = nodes.some((n) => n.type === "queue");
  const serviceNodes = nodes.filter((n) => n.type === "microservice");
  const dbNodes = nodes.filter((n) => n.type === "database");
  const frontendNodes = nodes.filter((n) => n.type === "frontend");

  // 1. API Gateway Ingress Pattern
  if (hasGateway) {
    const gw = nodes.find((n) => n.type === "gateway")!;
    patterns.push({
      id: "pat-api-gateway",
      name: "API Gateway Ingress Pattern",
      confidence: "High",
      evidence: [
        `Ingress Gateway node (${gw.name}) encapsulates backend routing.`,
        "Decouples client tier from internal microservice IPs.",
        "Centralizes TLS termination and authentication tokens.",
      ],
      relevantNodeIds: [gw.id, ...serviceNodes.map((s) => s.id)],
    });
  }

  // 2. Event-Driven Architecture (EDA)
  if (hasQueue) {
    const queue = nodes.find((n) => n.type === "queue")!;
    patterns.push({
      id: "pat-eda",
      name: "Event-Driven Architecture (EDA)",
      confidence: "High",
      evidence: [
        `Asynchronous Event Bus (${queue.name}) handles message streaming.`,
        "Publishers and consumer microservices operate asynchronously.",
        "Prevents synchronous HTTP thread exhaustion during traffic spikes.",
      ],
      relevantNodeIds: [queue.id, ...serviceNodes.map((s) => s.id)],
    });
  }

  // 3. Cache-Aside Pattern
  if (hasCache && dbNodes.length > 0) {
    const cache = nodes.find((n) => n.type === "cache")!;
    patterns.push({
      id: "pat-cache-aside",
      name: "Cache-Aside Pattern",
      confidence: "High",
      evidence: [
        `In-memory Redis Cache (${cache.name}) buffers database reads.`,
        "Application queries cache first and falls back to database on cache miss.",
        "Sub-millisecond read throughput for high-frequency data.",
      ],
      relevantNodeIds: [cache.id, ...dbNodes.map((d) => d.id)],
    });
  }

  // 4. Microservices Architecture
  if (serviceNodes.length >= 2) {
    patterns.push({
      id: "pat-microservices",
      name: "Microservices Architecture",
      confidence: serviceNodes.length >= 4 ? "High" : "Medium",
      evidence: [
        `${serviceNodes.length} modular microservices manage distinct domain logic.`,
        "Services communicate over explicit network protocols (REST / gRPC).",
        "Independent deployment boundaries and horizontal pod autoscaling.",
      ],
      relevantNodeIds: serviceNodes.map((s) => s.id),
    });
  }

  // 5. Client-Server Tier Pattern
  if (frontendNodes.length > 0 && (serviceNodes.length > 0 || dbNodes.length > 0)) {
    patterns.push({
      id: "pat-client-server",
      name: "Client-Server Layered Tier Pattern",
      confidence: "High",
      evidence: [
        "Client tier (Web/Mobile) separated from backend application logic.",
        "Enforces protocol boundary separation.",
      ],
      relevantNodeIds: [...frontendNodes.map((f) => f.id), ...dbNodes.map((d) => d.id)],
    });
  }

  return patterns;
}
