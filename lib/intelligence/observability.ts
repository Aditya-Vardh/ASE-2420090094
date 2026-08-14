import type { ArchitectureGraph } from "@/lib/graph/types";
import type { IntelligenceFinding } from "./types";

export function analyzeObservabilityIntelligence(graph: ArchitectureGraph): IntelligenceFinding[] {
  const findings: IntelligenceFinding[] = [];
  const nodes = graph.nodes;

  if (!nodes || nodes.length === 0) return findings;

  const hasTracing = nodes.some((n) => n.name.toLowerCase().includes("trace") || n.name.toLowerCase().includes("jaeger") || n.name.toLowerCase().includes("otel"));
  const hasMetrics = nodes.some((n) => n.name.toLowerCase().includes("prom") || n.name.toLowerCase().includes("metric") || n.name.toLowerCase().includes("grafana"));
  const hasLogs = nodes.some((n) => n.name.toLowerCase().includes("log") || n.name.toLowerCase().includes("elk") || n.name.toLowerCase().includes("loki"));

  const serviceNodes = nodes.filter((n) => n.type === "microservice" || n.type === "gateway");

  if (!hasTracing && serviceNodes.length >= 2) {
    findings.push({
      id: "obs-missing-tracing",
      category: "OBSERVABILITY",
      severity: "HIGH",
      title: "Missing Distributed Tracing Telemetry",
      description: "Architecture lacks OpenTelemetry / Jaeger distributed tracing across multi-service RPC boundaries.",
      affectedNodes: serviceNodes.map((s) => s.id),
      impact: "Inability to trace end-to-end request latencies or locate microservice bottlenecks during P99 latency spikes.",
      recommendation: "Deploy OpenTelemetry collector and instrument services with W3C tracecontext headers.",
      rationale: `Graph evidence: ${serviceNodes.length} services operate without OpenTelemetry tracing nodes.`,
      source: "Observability Analysis Engine (Distributed Tracing)",
    });
  }

  if (!hasMetrics) {
    findings.push({
      id: "obs-missing-metrics",
      category: "OBSERVABILITY",
      severity: "MEDIUM",
      title: "Missing Centralized Metrics Scraper",
      description: "No Prometheus or Grafana metrics collection pipeline detected for CPU, RAM, or HTTP error rate telemetry.",
      affectedNodes: nodes.slice(0, 3).map((n) => n.id),
      impact: "Lack of real-time visibility into memory leaks, thread pool saturation, or HTTP 5xx error spikes.",
      recommendation: "Deploy Prometheus scrapper with Grafana dashboard alerts for RED/USE metrics.",
      rationale: "Graph evidence: 0 Prometheus or metrics collector components in topology.",
      source: "Observability Analysis Engine (Metrics Telemetry)",
    });
  }

  if (!hasLogs) {
    findings.push({
      id: "obs-missing-logging",
      category: "OBSERVABILITY",
      severity: "LOW",
      title: "Unaggregated Application Logs",
      description: "Services emit logs to stdout without a centralized ELK or Grafana Loki log aggregation buffer.",
      affectedNodes: serviceNodes.slice(0, 2).map((s) => s.id),
      impact: "Troubleshooting distributed exceptions requires ssh-ing into individual container instances.",
      recommendation: "Route container stdout logs to Grafana Loki or Vector collector.",
      rationale: "Graph evidence: 0 log aggregator components detected.",
      source: "Observability Analysis Engine (Log Aggregation)",
    });
  }

  return findings;
}
