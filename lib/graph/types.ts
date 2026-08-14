import type { DiagramType } from "@/lib/storage/types";

export type ComponentType =
  | "frontend"
  | "gateway"
  | "microservice"
  | "database"
  | "cache"
  | "queue"
  | "storage"
  | "auth"
  | "worker"
  | "external";

export type RiskSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export type ArchNode = {
  id: string;
  name: string;
  type: ComponentType;
  layer: string;
  technology: string;
  description: string;
  scalingStrategy: string;
  failureModes: string[];
  riskLevel: RiskSeverity;
};

export type ArchEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  protocol: string;
  isSync: boolean;
};

export type ArchitectureGraph = {
  title: string;
  diagramType: DiagramType;
  nodes: ArchNode[];
  edges: ArchEdge[];
};

export type RiskIssue = {
  id: string;
  title: string;
  severity: RiskSeverity;
  category: "scalability" | "reliability" | "security" | "maintainability" | "performance";
  description: string;
  affectedNodeIds: string[];
  affectedEdgeIds?: string[];
  whyItMatters: string;
  potentialImpact: string;
  recommendedSolution: string;
};

export type DetailedHealthScore = {
  overall: number;
  label: "Excellent" | "Good" | "Needs Attention" | "Critical";
  scalability: { score: number; reason: string };
  reliability: { score: number; reason: string };
  security: { score: number; reason: string };
  performance: { score: number; reason: string };
  maintainability: { score: number; reason: string };
  resilience: { score: number; reason: string };
  coupling: { score: number; reason: string };
  complexity: { score: number; reason: string };
  availability: { score: number; reason: string };
  costTier: "LOW" | "MEDIUM" | "HIGH" | "VERY HIGH";
  costDrivers: string[];
};

export type OptimizationChange = {
  id: string;
  type: "ADD_NODE" | "REMOVE_NODE" | "MODIFY_EDGE" | "ADD_EDGE" | "REPLACE_COMPONENT";
  title: string;
  description: string;
  why: string;
  expectedBenefit: string;
  tradeoff: string;
  nodeIds: string[];
};

export type OptimizationResult = {
  originalGraph: ArchitectureGraph;
  optimizedGraph: ArchitectureGraph;
  originalHealth: number;
  optimizedHealth: number;
  changes: OptimizationChange[];
  explanation: string;
};

export type SimulationScenario = {
  users: number; // e.g. 100000, 1000000, 10000000
  requestRateRPS: number;
  trafficLevel: "Low" | "Medium" | "High" | "Extreme";
  availabilityTarget: "99%" | "99.9%" | "99.99%" | "99.999%";
  regionCount: number;
};

export type SimulationResult = {
  scenario: SimulationScenario;
  isViable: boolean;
  bottleneckNodeIds: string[];
  overloadedDatabaseIds: string[];
  latencyIncreaseMs: number;
  failureRisks: string[];
  recommendedAdditions: string[];
  analysis: string;
};
