import type { ArchitectureGraph, OptimizationResult, OptimizationChange, ArchNode, ArchEdge } from "../graph/types";
import { evaluateArchitectureScore } from "../analysis/scoring";
import { repairMermaid } from "@/lib/mermaid-repair";

export function optimizeArchitecture(graph: ArchitectureGraph): OptimizationResult {
  const originalScore = evaluateArchitectureScore(graph);

  const newNodes: ArchNode[] = [...graph.nodes];
  const newEdges: ArchEdge[] = [...graph.edges];
  const changes: OptimizationChange[] = [];

  const hasCache = newNodes.some((n) => n.type === "cache");
  const hasQueue = newNodes.some((n) => n.type === "queue");
  const hasGateway = newNodes.some((n) => n.type === "gateway");
  const dbNodes = newNodes.filter((n) => n.type === "database");
  const serviceNodes = newNodes.filter((n) => n.type === "microservice");

  // 1. Add Redis Cache if missing
  if (!hasCache && dbNodes.length > 0) {
    const cacheId = "RedisCache";
    const cacheNode: ArchNode = {
      id: cacheId,
      name: "Redis Cache Cluster",
      type: "cache",
      layer: "Persistence Layer",
      technology: "Redis Enterprise v7",
      description: "In-memory cache layer storing high-frequency read queries and active session state under 1ms latency.",
      scalingStrategy: "Redis Sentinel / Cluster Sharding",
      failureModes: ["Cache eviction under memory pressure"],
      riskLevel: "LOW",
    };
    newNodes.push(cacheNode);

    // Rewire database callers to check cache first
    serviceNodes.forEach((s) => {
      newEdges.push({
        id: `e-${s.id}-${cacheId}`,
        sourceId: s.id,
        targetId: cacheId,
        label: "Sub-ms Read Cache",
        protocol: "Redis RESP / TCP",
        isSync: true,
      });
    });

    changes.push({
      id: "change-add-cache",
      type: "ADD_NODE",
      title: "Introduced Redis Cache Cluster",
      description: "Added in-memory Redis cluster in front of primary relational databases.",
      why: "Database queries were bottlenecking read throughput under high concurrent user load.",
      expectedBenefit: "Reduces database disk read IOPS by 85% and improves endpoint response latencies to sub-10ms.",
      tradeoff: "Requires cache invalidation logic on data updates.",
      nodeIds: [cacheId, ...dbNodes.map((d) => d.id)],
    });
  }

  // 2. Add Apache Kafka Event Bus if missing
  if (!hasQueue && serviceNodes.length >= 2) {
    const queueId = "KafkaQueue";
    const queueNode: ArchNode = {
      id: queueId,
      name: "Apache Kafka Event Bus",
      type: "queue",
      layer: "Event Bus Layer",
      technology: "Apache Kafka 3.6",
      description: "High-throughput event streaming bus isolating synchronous calls into async event pipelines.",
      scalingStrategy: "Partition Partitioning & Broker Cluster",
      failureModes: ["Consumer lag buildup"],
      riskLevel: "LOW",
    };
    newNodes.push(queueNode);

    if (serviceNodes.length > 0) {
      newEdges.push({
        id: `e-${serviceNodes[0].id}-${queueId}`,
        sourceId: serviceNodes[0].id,
        targetId: queueId,
        label: "Publish Event Stream",
        protocol: "Kafka Protocol",
        isSync: false,
      });
    }

    changes.push({
      id: "change-add-queue",
      type: "ADD_NODE",
      title: "Added Apache Kafka Asynchronous Event Bus",
      description: "Decoupled synchronous REST dependencies using event-driven pub/sub architecture.",
      why: "Direct HTTP RPC chains propagated downstream latency and service crash risks.",
      expectedBenefit: "Prevents cascading failures and enables peak write burst absorption.",
      tradeoff: "Requires handling eventual consistency across services.",
      nodeIds: [queueId],
    });
  }

  // 3. Add API Gateway if missing
  if (!hasGateway) {
    const gwId = "APIGateway";
    const gwNode: ArchNode = {
      id: gwId,
      name: "API Gateway & Router",
      type: "gateway",
      layer: "Ingress Layer",
      technology: "Traefik / Kong Gateway",
      description: "Central entry point handling TLS termination, JWT token validation, CORS, and rate limiting.",
      scalingStrategy: "Horizontal Ingress Pod Scaling",
      failureModes: ["Ingress bandwidth saturation"],
      riskLevel: "LOW",
    };
    newNodes.unshift(gwNode);

    changes.push({
      id: "change-add-gateway",
      type: "ADD_NODE",
      title: "Deployed Centralized API Gateway",
      description: "Encapsulated core microservices behind a unified ingress gateway.",
      why: "Exposing microservices directly created security vulnerabilities and fragmented CORS logic.",
      expectedBenefit: "Centralizes authentication, rate limiting, and SSL termination.",
      tradeoff: "Slight network hop overhead (1-2ms).",
      nodeIds: [gwId],
    });
  }

  // Re-generate Mermaid code for optimized graph
  const mermaidLines = ["flowchart TB"];
  const subgraphs = new Map<string, ArchNode[]>();
  newNodes.forEach((n) => {
    const layer = n.layer || "Core Services";
    const arr = subgraphs.get(layer) || [];
    arr.push(n);
    subgraphs.set(layer, arr);
  });

  subgraphs.forEach((nodesInLayer, layerName) => {
    const safeLayerId = layerName.replace(/[^a-zA-Z0-9]/g, "");
    mermaidLines.push(`    subgraph ${safeLayerId}["${layerName}"]`);
    nodesInLayer.forEach((n) => {
      mermaidLines.push(`        ${n.id}["${n.name}"]`);
    });
    mermaidLines.push("    end");
  });

  newEdges.forEach((e) => {
    const labelStr = e.label ? ` -->|${e.label}| ` : " --> ";
    mermaidLines.push(`    ${e.sourceId}${labelStr}${e.targetId}`);
  });

  const optimizedMermaid = repairMermaid(mermaidLines.join("\n"), "flowchart");

  const optimizedGraph: ArchitectureGraph = {
    ...graph,
    title: `${graph.title} (Optimized)`,
    nodes: newNodes,
    edges: newEdges,
  };

  const optimizedScore = evaluateArchitectureScore(optimizedGraph);

  return {
    originalGraph: graph,
    optimizedGraph,
    originalHealth: originalScore.overall,
    optimizedHealth: Math.min(100, optimizedScore.overall),
    changes,
    explanation: changes.length > 0
      ? `Arqen AI optimized ${graph.title} by applying ${changes.length} structural change(s): ${changes.map((c) => c.title).join("; ")}.`
      : `${graph.title} is already well-optimized. No additional structural changes were identified.`,
  };
}
