import type { ArchNode, ArchEdge, ArchitectureGraph, RiskSeverity } from "@/lib/graph/types";

export type FindingCategory =
  | "SECURITY"
  | "RELIABILITY"
  | "SCALABILITY"
  | "PERFORMANCE"
  | "OBSERVABILITY"
  | "COST"
  | "MAINTAINABILITY"
  | "RESILIENCE";

export type IntelligenceFinding = {
  id: string;
  category: FindingCategory;
  severity: RiskSeverity;
  title: string;
  description: string;
  affectedNodes: string[];
  affectedEdges?: string[];
  impact: string;
  recommendation: string;
  rationale: string;
  source: string;
};

export type FailurePathResult = {
  sourceNodeId: string;
  sourceNodeName: string;
  directlyAffectedNodeIds: string[];
  indirectlyAffectedNodeIds: string[];
  affectedEdgeIds: string[];
  operatingNodeIds: string[];
  cascadingChain: string[];
  explanation: string;
  resilienceRecommendation: string;
};

export type PatternDetectionResult = {
  id: string;
  name: string;
  confidence: "High" | "Medium" | "Low";
  evidence: string[];
  relevantNodeIds: string[];
};

export type CostAnalysisResult = {
  costTier: "LOW" | "MEDIUM" | "HIGH" | "VERY HIGH";
  primaryDrivers: string[];
  recommendations: string[];
  tradeoffExplanation: string;
};

export type DecisionExplanation = {
  problem: string;
  decision: string;
  benefit: string;
  tradeoff: string;
  evidence: string;
  affectedNodeIds: string[];
};

export type UnifiedRecommendation = {
  id: string;
  title: string;
  category: FindingCategory;
  decision: DecisionExplanation;
  mutationType: "ADD_CACHE" | "ADD_GATEWAY" | "IMPROVE_COMPONENT" | "ADD_QUEUE" | "ISOLATE_DB";
  targetNodeId?: string;
};

export type VersionDiffResult = {
  v1Title: string;
  v2Title: string;
  healthDelta: number;
  securityDelta: number;
  reliabilityDelta: number;
  scalabilityDelta: number;
  addedNodeNames: string[];
  removedNodeNames: string[];
  modifiedNodeNames: string[];
  resolvedFindingTitles: string[];
  newFindingTitles: string[];
};

export type UnifiedIntelligenceResult = {
  overallHealthScore: number;
  dimensionScores: {
    scalability: number;
    reliability: number;
    security: number;
    performance: number;
    maintainability: number;
    availability: number;
    resilience: number;
    observability: number;
    costEfficiency: number;
    complexity: number;
  };
  findings: IntelligenceFinding[];
  patterns: PatternDetectionResult[];
  cost: CostAnalysisResult[];
  recommendations: UnifiedRecommendation[];
};
