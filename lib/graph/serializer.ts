import type { ArchitectureGraph, ArchNode, ArchEdge, ComponentType, RiskSeverity } from "./types";
import { repairMermaid } from "@/lib/mermaid-repair";

/**
 * Single Canonical Converter: Converts ArchitectureGraph into clean, valid Mermaid code.
 * ArchitectureGraph is the ONLY source of truth. Mermaid is ALWAYS derived from the graph.
 */
export function graphToMermaid(graph: ArchitectureGraph): string {
  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return `flowchart TB\n    Client["Client Application"] --> Gateway["API Gateway"]\n    Gateway --> DB[("Database")]`;
  }

  const lines: string[] = ["flowchart TB"];

  // Group nodes by layer into subgraphs
  const layerMap = new Map<string, ArchNode[]>();
  graph.nodes.forEach((node) => {
    const layerName = node.layer || "Core System";
    const group = layerMap.get(layerName) || [];
    group.push(node);
    layerMap.set(layerName, group);
  });

  layerMap.forEach((nodesInLayer, layerName) => {
    const safeLayerId = layerName.replace(/[^a-zA-Z0-9]/g, "");
    lines.push(`    subgraph ${safeLayerId}["${layerName}"]`);
    nodesInLayer.forEach((n) => {
      // Shape syntax based on type
      if (n.type === "database") {
        lines.push(`        ${n.id}[("${n.name}")]`);
      } else if (n.type === "cache" || n.type === "storage") {
        lines.push(`        ${n.id}[("${n.name}")]`);
      } else if (n.type === "frontend") {
        lines.push(`        ${n.id}["${n.name}"]`);
      } else {
        lines.push(`        ${n.id}["${n.name}"]`);
      }
    });
    lines.push("    end");
  });

  // Render Edges
  graph.edges.forEach((edge) => {
    const label = edge.label ? ` -->|${edge.label}| ` : " --> ";
    lines.push(`    ${edge.sourceId}${label}${edge.targetId}`);
  });

  return repairMermaid(lines.join("\n"), graph.diagramType);
}

/**
 * Graph Mutation: Adds a Redis Cache in front of a target node (e.g. Database).
 */
export function addCacheToGraph(graph: ArchitectureGraph, targetNodeId: string): ArchitectureGraph {
  const targetNode = graph.nodes.find((n) => n.id === targetNodeId || n.name.toLowerCase() === targetNodeId.toLowerCase());
  if (!targetNode) return graph;

  const cacheId = `RedisCache_${Date.now().toString(36).slice(-4)}`;
  const cacheNode: ArchNode = {
    id: cacheId,
    name: `Redis Cache (${targetNode.name})`,
    type: "cache",
    layer: "Persistence Layer",
    technology: "Redis Enterprise",
    description: `In-memory cache layer buffering read queries for ${targetNode.name}.`,
    scalingStrategy: "Sentinel Cluster / Sharding",
    failureModes: ["Cache eviction under memory pressure"],
    riskLevel: "LOW" as RiskSeverity,
  };

  const newNodes = [...graph.nodes, cacheNode];
  const newEdges = [...graph.edges];

  // Find incoming callers to target node and redirect them to cache first
  const callerEdges = graph.edges.filter((e) => e.targetId === targetNode.id);
  callerEdges.forEach((e) => {
    newEdges.push({
      id: `e-${e.sourceId}-${cacheId}`,
      sourceId: e.sourceId,
      targetId: cacheId,
      label: "Sub-ms Read Cache",
      protocol: "Redis RESP",
      isSync: true,
    });
  });

  // Connect cache to database
  newEdges.push({
    id: `e-${cacheId}-${targetNode.id}`,
    sourceId: cacheId,
    targetId: targetNode.id,
    label: "Cache Miss Query",
    protocol: "SQL / Connection Pool",
    isSync: true,
  });

  return {
    ...graph,
    nodes: newNodes,
    edges: newEdges,
  };
}

/**
 * Graph Mutation: Adds an API Gateway to the graph if missing.
 */
export function addGatewayToGraph(graph: ArchitectureGraph): ArchitectureGraph {
  if (graph.nodes.some((n) => n.type === "gateway")) return graph;

  const gwId = `APIGateway_${Date.now().toString(36).slice(-4)}`;
  const gwNode: ArchNode = {
    id: gwId,
    name: "API Gateway & Router",
    type: "gateway",
    layer: "Ingress Layer",
    technology: "Traefik / Kong",
    description: "Centralized entry gateway handling TLS termination, rate limiting, and routing.",
    scalingStrategy: "Horizontal Pod Autoscaling",
    failureModes: ["Ingress bandwidth saturation"],
    riskLevel: "LOW" as RiskSeverity,
  };

  const frontendNodes = graph.nodes.filter((n) => n.type === "frontend");
  const serviceNodes = graph.nodes.filter((n) => n.type === "microservice");

  const newNodes = [gwNode, ...graph.nodes];
  const newEdges = [...graph.edges];

  if (frontendNodes.length > 0 && serviceNodes.length > 0) {
    frontendNodes.forEach((fn) => {
      newEdges.push({
        id: `e-${fn.id}-${gwId}`,
        sourceId: fn.id,
        targetId: gwId,
        label: "HTTPS Traffic",
        protocol: "HTTPS / REST",
        isSync: true,
      });
    });
    serviceNodes.forEach((sn) => {
      newEdges.push({
        id: `e-${gwId}-${sn.id}`,
        sourceId: gwId,
        targetId: sn.id,
        label: "Internal Route",
        protocol: "gRPC / Internal",
        isSync: true,
      });
    });
  }

  return {
    ...graph,
    nodes: newNodes,
    edges: newEdges,
  };
}

/**
 * Graph Mutation: Improves a specific component with AI recommendation.
 */
export function improveComponentInGraph(
  graph: ArchitectureGraph,
  nodeId: string,
  recommendation: string
): ArchitectureGraph {
  const newNodes = graph.nodes.map((n) => {
    if (n.id === nodeId || n.name.toLowerCase() === nodeId.toLowerCase()) {
      return {
        ...n,
        description: `${n.description} (Improved: ${recommendation})`,
        scalingStrategy: "Multi-Region Auto-Scaling & Load Balancing",
        riskLevel: "LOW" as RiskSeverity,
      };
    }
    return n;
  });

  return {
    ...graph,
    nodes: newNodes,
  };
}
