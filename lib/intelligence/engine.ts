import type { ArchitectureGraph } from "@/lib/graph/types";
import type { UnifiedIntelligenceResult, UnifiedRecommendation } from "./types";
import { analyzeSecurityIntelligence } from "./security";
import { analyzeReliabilityIntelligence } from "./reliability";
import { analyzeObservabilityIntelligence } from "./observability";
import { detectArchitecturePatterns } from "./patterns";
import { analyzeCostIntelligence } from "./cost";

export function evaluateUnifiedIntelligence(graph: ArchitectureGraph): UnifiedIntelligenceResult {
  const securityFindings = analyzeSecurityIntelligence(graph);
  const reliabilityFindings = analyzeReliabilityIntelligence(graph);
  const observabilityFindings = analyzeObservabilityIntelligence(graph);
  const patterns = detectArchitecturePatterns(graph);
  const cost = analyzeCostIntelligence(graph);

  const allFindings = [...securityFindings, ...reliabilityFindings, ...observabilityFindings];

  const hasCache = graph.nodes.some((n) => n.type === "cache");
  const hasQueue = graph.nodes.some((n) => n.type === "queue");
  const hasGateway = graph.nodes.some((n) => n.type === "gateway");
  const hasAuth = graph.nodes.some((n) => n.type === "auth");
  const hasTracing = graph.nodes.some((n) => n.name.toLowerCase().includes("trace") || n.name.toLowerCase().includes("otel"));

  // Calculate 10 Dimension Scores (0-100) deterministically from graph evidence
  const scalability = Math.min(98, Math.max(55, 68 + (hasCache ? 14 : 0) + (hasQueue ? 12 : 0) + (hasGateway ? 6 : 0)));
  const reliability = Math.min(98, Math.max(50, 72 + (hasQueue ? 12 : 0) + (hasCache ? 8 : 0) - (reliabilityFindings.length * 6)));
  const security = Math.min(98, Math.max(50, 70 + (hasAuth ? 14 : 0) + (hasGateway ? 10 : 0) - (securityFindings.length * 5)));
  const performance = Math.min(98, Math.max(55, 70 + (hasCache ? 18 : 0)));
  const maintainability = Math.min(96, Math.max(60, 88 - Math.floor(graph.nodes.length / 3)));
  const availability = Math.min(98, Math.max(60, 76 + (hasGateway ? 10 : 0) + (hasQueue ? 8 : 0)));
  const resilience = Math.round((scalability + reliability) / 2);
  const observability = Math.min(98, Math.max(45, 55 + (hasTracing ? 25 : 0) + (hasGateway ? 10 : 0)));
  const costEfficiency = cost[0]?.costTier === "LOW" ? 92 : cost[0]?.costTier === "MEDIUM" ? 82 : 72;
  const complexity = Math.min(95, Math.max(60, 90 - graph.nodes.length));

  const overallHealthScore = Math.round(
    scalability * 0.15 +
    reliability * 0.15 +
    security * 0.15 +
    performance * 0.1 +
    maintainability * 0.1 +
    availability * 0.1 +
    resilience * 0.1 +
    observability * 0.05 +
    costEfficiency * 0.05 +
    complexity * 0.05
  );

  // Derive Unified Recommendations with Problem -> Decision -> Benefit -> Trade-off -> Evidence
  const recommendations: UnifiedRecommendation[] = [];

  if (!hasCache && graph.nodes.some((n) => n.type === "database")) {
    const targetDb = graph.nodes.find((n) => n.type === "database")!;
    recommendations.push({
      id: "rec-add-cache",
      title: "Introduce Redis In-Memory Cache Cluster",
      category: "PERFORMANCE",
      mutationType: "ADD_CACHE",
      targetNodeId: targetDb.id,
      decision: {
        problem: `High read query fan-in to ${targetDb.name} causes disk I/O bottlenecks under spike load.`,
        decision: `Deploy an in-memory Redis cluster in front of ${targetDb.name} with cache-aside strategy.`,
        benefit: "Reduces database read IOPS by 85% and improves read endpoint response times to sub-5ms.",
        tradeoff: "Requires cache invalidation logic on database writes and extra memory infrastructure.",
        evidence: `Graph evidence: ${targetDb.name} has 0 cache buffer nodes attached in persistence tier.`,
        affectedNodeIds: [targetDb.id],
      },
    });
  }

  if (!hasGateway) {
    recommendations.push({
      id: "rec-add-gateway",
      title: "Deploy Traefik / Kong Centralized API Gateway",
      category: "SECURITY",
      mutationType: "ADD_GATEWAY",
      decision: {
        problem: "Frontend applications directly query microservices without ingress rate limiting or auth token validation.",
        decision: "Encapsulate microservices behind a centralized API Gateway ingress router.",
        benefit: "Centralizes TLS termination, JWT verification, rate limiting, and CORS routing.",
        tradeoff: "Slight network hop overhead (1-2ms).",
        evidence: "Graph evidence: 0 gateway components found in active topology.",
        affectedNodeIds: graph.nodes.filter((n) => n.type === "frontend" || n.type === "microservice").map((n) => n.id),
      },
    });
  }

  return {
    overallHealthScore,
    dimensionScores: {
      scalability,
      reliability,
      security,
      performance,
      maintainability,
      availability,
      resilience,
      observability,
      costEfficiency,
      complexity,
    },
    findings: allFindings,
    patterns,
    cost,
    recommendations,
  };
}
