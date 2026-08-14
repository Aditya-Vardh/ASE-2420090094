export type DiagramType =
  | "class"
  | "sequence"
  | "er"
  | "flowchart"
  | "component"
  | "deployment"
  | "state"
  | "architecture";

export type ArchitectureExplanation = {
  overview: string;
  components: { name: string; description: string }[];
  dataFlow: string;
  technologyChoices: string;
  scalability: string;
  security: string;
  reliability: string;
  tradeoffs: string;
  improvements: string;
};

/** Adaptive Software Engineering insights — optional for backward compatibility with saved projects. */
export type AdaptiveSuggestion = {
  current: string;
  suggested: string;
  reason: string;
  category: "scalability" | "maintainability" | "reliability" | "security" | "adaptability";
};

export type AdaptiveInsights = {
  health: number;
  healthLabel: string;
  scalability: number;
  maintainability: number;
  reliability: number;
  security: number;
  adaptability: number;
  potentialIssues: string[];
  suggestions: AdaptiveSuggestion[];
};

export type ArchitectureResult = {
  title: string;
  diagramType: DiagramType;
  mermaidCode: string;
  explanation: ArchitectureExplanation;
  technologies: string[];
  /** Present on new generations; derived client-side for older saved projects. */
  adaptiveInsights?: AdaptiveInsights;
};

export type ResearchResult = {
  question: string;
  answer: string;
  recommendations: string[];
  alternatives: {
    name: string;
    description: string;
    pros: string[];
    cons: string[];
  }[];
  tradeoffs: string;
  architectureImplications: string;
  relevantTechnologies: string[];
  risks: string[];
};

export type GenerationStatus = "success" | "error";

export type HistoryEntry = {
  id: string;
  projectId: string;
  projectTitle: string;
  prompt: string;
  diagramType: DiagramType;
  status: GenerationStatus;
  result?: ArchitectureResult;
  error?: string;
  createdAt: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  diagramType: DiagramType;
  result?: ArchitectureResult;
  createdAt: string;
  updatedAt: string;
};

export type ThemeMode = "dark" | "light" | "system";

export type AppSettings = {
  defaultDiagramType: DiagramType;
  autoSaveProjects: boolean;
  showExplanationByDefault: boolean;
  theme: ThemeMode;
};

export const DEFAULT_SETTINGS: AppSettings = {
  defaultDiagramType: "architecture",
  autoSaveProjects: true,
  showExplanationByDefault: true,
  theme: "dark",
};

export const DIAGRAM_TYPE_LABELS: Record<DiagramType, string> = {
  class: "Class Diagram",
  sequence: "Sequence Diagram",
  er: "ER Diagram",
  flowchart: "Flowchart",
  component: "Component Diagram",
  deployment: "Deployment Diagram",
  state: "State Diagram",
  architecture: "Architecture Diagram",
};
