import type { ArchitectureGraph, ArchNode, ArchEdge, ComponentType, RiskSeverity } from "./types";
import type { DiagramType } from "@/lib/storage/types";

function inferComponentType(name: string): ComponentType {
  const lower = name.toLowerCase();
  if (lower.includes("db") || lower.includes("database") || lower.includes("postgres") || lower.includes("mongo") || lower.includes("scylla") || lower.includes("timescale")) return "database";
  if (lower.includes("cache") || lower.includes("redis") || lower.includes("memcached")) return "cache";
  if (lower.includes("gateway") || lower.includes("router") || lower.includes("ingress") || lower.includes("proxy")) return "gateway";
  if (lower.includes("queue") || lower.includes("kafka") || lower.includes("nats") || lower.includes("rabbitmq") || lower.includes("broker") || lower.includes("bus")) return "queue";
  if (lower.includes("auth") || lower.includes("jwt") || lower.includes("keycloak") || lower.includes("identity")) return "auth";
  if (lower.includes("s3") || lower.includes("vault") || lower.includes("bucket") || lower.includes("store")) return "storage";
  if (lower.includes("web") || lower.includes("app") || lower.includes("portal") || lower.includes("client") || lower.includes("ui") || lower.includes("storefront") || lower.includes("mobile")) return "frontend";
  if (lower.includes("worker") || lower.includes("job") || lower.includes("fulfillment") || lower.includes("processor")) return "worker";
  if (lower.includes("stripe") || lower.includes("external") || lower.includes("emr") || lower.includes("third")) return "external";
  return "microservice";
}

function inferLayer(type: ComponentType): string {
  switch (type) {
    case "frontend": return "Client Layer";
    case "gateway": return "Ingress Layer";
    case "auth": return "Security Layer";
    case "microservice": return "Business Logic Layer";
    case "worker": return "Background Worker Layer";
    case "database": case "cache": case "storage": return "Persistence Layer";
    case "queue": return "Event Bus Layer";
    case "external": return "External Services Layer";
  }
}

function inferProtocol(sourceType: ComponentType, targetType: ComponentType, text: string): { protocol: string; isSync: boolean } {
  const lower = text.toLowerCase();
  if (lower.includes("mqtt")) return { protocol: "5G MQTT", isSync: false };
  if (lower.includes("kafka") || lower.includes("amqp") || lower.includes("queue")) return { protocol: "AMQP Event", isSync: false };
  if (lower.includes("socket") || lower.includes("ws")) return { protocol: "WebSocket", isSync: true };
  if (lower.includes("grpc") || lower.includes("protobuf")) return { protocol: "gRPC / Protobuf", isSync: true };
  if (targetType === "database" || targetType === "cache") return { protocol: "SQL / Connection Pool", isSync: true };
  if (sourceType === "frontend" || sourceType === "gateway") return { protocol: "HTTPS / REST", isSync: true };
  return { protocol: "HTTPS / JSON API", isSync: true };
}

export function parseMermaidToGraph(
  mermaidCode: string,
  diagramType: DiagramType = "architecture",
  title = "Architecture Specification",
  rawComponents: { name: string; description: string }[] = [],
  rawTechnologies: string[] = []
): ArchitectureGraph {
  const nodesMap = new Map<string, ArchNode>();
  const edges: ArchEdge[] = [];

  const lines = mermaidCode.split("\n");
  let currentSubgraph = "";

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("subgraph")) {
      const match = trimmed.match(/subgraph\s+([^\s"[]+)(?:\["([^"]+)"\])?/);
      currentSubgraph = match ? (match[2] || match[1]) : "Core System";
      return;
    }
    if (trimmed === "end") {
      currentSubgraph = "";
      return;
    }

    // Node definitions like ID["Label"] or ID[("Label")]
    const nodeMatch = trimmed.match(/([A-Za-z0-9_]+)\[+["']?([^"'\]]+)["']?\]+/);
    if (nodeMatch) {
      const id = nodeMatch[1];
      const name = nodeMatch[2];
      if (!nodesMap.has(id)) {
        const type = inferComponentType(name);
        const compDesc = rawComponents.find((c) => c.name.toLowerCase() === name.toLowerCase())?.description ||
          `Executes core functions for ${name}.`;
        const tech = rawTechnologies.find((t) => name.toLowerCase().includes(t.toLowerCase())) ||
          (type === "database" ? "PostgreSQL" : type === "cache" ? "Redis" : type === "gateway" ? "API Gateway" : "Node.js / Go");

        nodesMap.set(id, {
          id,
          name,
          type,
          layer: currentSubgraph || inferLayer(type),
          technology: tech || "Unspecified Runtime",
          description: compDesc,
          scalingStrategy: type === "database" ? "Relational Replica Pool" : type === "cache" ? "In-Memory Cluster" : "No explicit autoscaling defined",
          failureModes: [
            type === "database" ? "Disk I/O Saturation under spike loads" : type === "gateway" ? "Rate Limit exhaustion" : "Network Latency / Timeout",
          ],
          riskLevel: (type === "database" && !mermaidCode.includes("Redis")) ? "HIGH" as RiskSeverity : "LOW" as RiskSeverity,
        });
      }
    }

    // Edge definitions like A --> B or A -->|Protocol| B
    const edgeMatch = trimmed.match(/([A-Za-z0-9_]+)\s*(?:-->|-.->|==>)\s*(?:\|([^|]+)\|)?\s*([A-Za-z0-9_]+)/);
    if (edgeMatch) {
      const sourceId = edgeMatch[1];
      const labelText = edgeMatch[2] || "";
      const targetId = edgeMatch[3];

      // Ensure nodes exist if defined inline
      if (!nodesMap.has(sourceId)) {
        const type = inferComponentType(sourceId);
        nodesMap.set(sourceId, {
          id: sourceId, name: sourceId, type, layer: inferLayer(type), technology: "Node.js", description: `Service ${sourceId}`,
          scalingStrategy: "Horizontal Replica Scaling", failureModes: ["Latency Spikes"], riskLevel: "LOW",
        });
      }
      if (!nodesMap.has(targetId)) {
        const type = inferComponentType(targetId);
        nodesMap.set(targetId, {
          id: targetId, name: targetId, type, layer: inferLayer(type), technology: "Node.js", description: `Service ${targetId}`,
          scalingStrategy: "Horizontal Replica Scaling", failureModes: ["Latency Spikes"], riskLevel: "LOW",
        });
      }

      const sourceNode = nodesMap.get(sourceId)!;
      const targetNode = nodesMap.get(targetId)!;
      const { protocol, isSync } = inferProtocol(sourceNode.type, targetNode.type, labelText);

      edges.push({
        id: `e-${sourceId}-${targetId}-${edges.length}`,
        sourceId,
        targetId,
        label: labelText || undefined,
        protocol,
        isSync,
      });
    }
  });

  return {
    title,
    diagramType,
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}
