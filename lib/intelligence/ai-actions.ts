import type { ArchitectureGraph } from "@/lib/graph/types";

export type AIActionType =
  | "HIGHLIGHT_NODES"
  | "RUN_FAILURE_ANALYSIS"
  | "APPLY_RECOMMENDATION"
  | "ADD_CACHE"
  | "OPTIMIZE_ARCHITECTURE";

export type StructuredAIAction = {
  type: AIActionType;
  title: string;
  description: string;
  requiresConfirmation: boolean;
  nodeIds?: string[];
  targetNodeId?: string;
};

export function parseAndValidateAIActions(
  text: string,
  graph: ArchitectureGraph
): StructuredAIAction[] {
  const actions: StructuredAIAction[] = [];
  const validNodeIds = new Set(graph.nodes.map((n) => n.id.toLowerCase()));
  const validNodeNamesMap = new Map(graph.nodes.map((n) => [n.name.toLowerCase(), n.id]));

  const lower = text.toLowerCase();

  // 1. Highlight Nodes Action
  const matchedNodeIds: string[] = [];
  graph.nodes.forEach((node) => {
    if (lower.includes(node.name.toLowerCase()) || lower.includes(node.id.toLowerCase())) {
      matchedNodeIds.push(node.id);
    }
  });

  if (matchedNodeIds.length > 0 && (lower.includes("highlight") || lower.includes("show") || lower.includes("select"))) {
    actions.push({
      type: "HIGHLIGHT_NODES",
      title: "Highlight Affected Components",
      description: `Highlight ${matchedNodeIds.length} component(s) on canvas.`,
      requiresConfirmation: false,
      nodeIds: matchedNodeIds,
    });
  }

  // 2. Failure Analysis Action
  if (lower.includes("fail") || lower.includes("outage") || lower.includes("crash")) {
    const targetId = matchedNodeIds[0] || graph.nodes[0]?.id;
    actions.push({
      type: "RUN_FAILURE_ANALYSIS",
      title: "Run Failure-Path Analysis",
      description: `Trace cascading failure dependencies for selected node.`,
      requiresConfirmation: false,
      targetNodeId: targetId,
    });
  }

  // 3. Add Cache Action (Graph Mutating -> Requires Confirmation!)
  if (lower.includes("add cache") || lower.includes("redis cache") || lower.includes("buffer database")) {
    const targetDb = graph.nodes.find((n) => n.type === "database");
    actions.push({
      type: "ADD_CACHE",
      title: "Confirm Graph Mutation: Add Redis Cache",
      description: `Add in-memory Redis cluster in front of ${targetDb?.name || "database"}.`,
      requiresConfirmation: true,
      targetNodeId: targetDb?.id,
    });
  }

  // 4. Optimize Architecture Action (Graph Mutating -> Requires Confirmation!)
  if (lower.includes("optimize") || lower.includes("improve architecture") || lower.includes("scale system")) {
    actions.push({
      type: "OPTIMIZE_ARCHITECTURE",
      title: "Confirm Graph Mutation: Optimize Architecture",
      description: "Analyze weaknesses and produce optimized ArchitectureGraph.",
      requiresConfirmation: true,
    });
  }

  return actions;
}
