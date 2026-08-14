import type { ArchitectureGraph, ArchNode } from "@/lib/graph/types";
import type { FailurePathResult } from "./types";

/**
 * Generic Cycle-Safe Failure Path Traversal Engine.
 * Traverses ONLY actual ArchitectureGraph edges with path-specific cycle detection.
 * Works for ANY arbitrary architecture graph topology.
 */
export function analyzeComponentFailurePath(
  graph: ArchitectureGraph,
  targetNodeId: string
): FailurePathResult {
  const nodes = graph.nodes;
  const edges = graph.edges;

  if (!nodes || nodes.length === 0) {
    return {
      sourceNodeId: "",
      sourceNodeName: "None",
      directlyAffectedNodeIds: [],
      indirectlyAffectedNodeIds: [],
      affectedEdgeIds: [],
      operatingNodeIds: [],
      cascadingChain: [],
      explanation: "No component selected for failure path analysis.",
      resilienceRecommendation: "Select a component to inspect failure impact.",
    };
  }

  const targetNode =
    nodes.find(
      (n) =>
        n.id === targetNodeId ||
        n.id.toLowerCase() === targetNodeId.toLowerCase() ||
        n.name.toLowerCase() === targetNodeId.toLowerCase()
    ) || nodes[0];

  // Inbound call mapping: targetId -> list of sourceIds calling it
  const incomingEdgesMap = new Map<string, string[]>();
  const edgeIdMap = new Map<string, string>(); // `src-tgt` -> edgeId

  edges.forEach((e) => {
    const list = incomingEdgesMap.get(e.targetId) || [];
    list.push(e.sourceId);
    incomingEdgesMap.set(e.targetId, list);
    edgeIdMap.set(`${e.sourceId}->${e.targetId}`, e.id);
  });

  const directlyAffectedNodeIds: string[] = Array.from(
    new Set(incomingEdgesMap.get(targetNode.id) || [])
  );

  const affectedEdgeIds: string[] = [];
  directlyAffectedNodeIds.forEach((srcId) => {
    const edgeId = edgeIdMap.get(`${srcId}->${targetNode.id}`);
    if (edgeId) affectedEdgeIds.push(edgeId);
  });

  // Collect transitive upstream callers using cycle-safe DFS
  const indirectlyAffectedNodeIdsSet = new Set<string>();
  const branchPaths: string[][] = [];

  function traverseUpstream(currentId: string, currentPath: string[]) {
    const callers = incomingEdgesMap.get(currentId) || [];
    if (callers.length === 0) {
      if (currentPath.length > 1) {
        branchPaths.push([...currentPath]);
      }
      return;
    }

    callers.forEach((callerId) => {
      // Cycle prevention: do not revisit nodes already in current path
      if (currentPath.includes(callerId)) {
        branchPaths.push([...currentPath, `${callerId} (Cycle Detected)`]);
        return;
      }

      if (callerId !== targetNode.id && !directlyAffectedNodeIds.includes(callerId)) {
        indirectlyAffectedNodeIdsSet.add(callerId);
      }

      const eId = edgeIdMap.get(`${callerId}->${currentId}`);
      if (eId) affectedEdgeIds.push(eId);

      traverseUpstream(callerId, [...currentPath, callerId]);
    });
  }

  // Start traversal from target node
  traverseUpstream(targetNode.id, [targetNode.id]);

  const indirectlyAffectedNodeIds = Array.from(indirectlyAffectedNodeIdsSet);
  const totalAffectedSet = new Set([
    targetNode.id,
    ...directlyAffectedNodeIds,
    ...indirectlyAffectedNodeIds,
  ]);

  const operatingNodeIds = nodes.filter((n) => !totalAffectedSet.has(n.id)).map((n) => n.id);

  // Format cascading chain text for UI
  const nodeNameMap = new Map(nodes.map((n) => [n.id, n.name]));

  let cascadingChain: string[] = [];
  if (branchPaths.length > 0) {
    cascadingChain = branchPaths[0].map((id) => nodeNameMap.get(id) || id);
  } else if (directlyAffectedNodeIds.length > 0) {
    cascadingChain = [
      targetNode.name,
      ...directlyAffectedNodeIds.map((id) => nodeNameMap.get(id) || id),
    ];
  } else {
    cascadingChain = [targetNode.name];
  }

  let explanation = "";
  if (directlyAffectedNodeIds.length === 0) {
    explanation = `No dependent path detected. ${targetNode.name} is an entry point component; its failure does not cascade upstream to other services.`;
  } else if (indirectlyAffectedNodeIds.length === 0) {
    explanation = `Failure of ${targetNode.name} directly impacts ${directlyAffectedNodeIds.length} component(s) (${directlyAffectedNodeIds.map((id) => nodeNameMap.get(id) || id).join(", ")}) which depend directly on it.`;
  } else {
    explanation = `Failure of ${targetNode.name} directly impacts ${directlyAffectedNodeIds.length} service(s) and transitively degrades ${indirectlyAffectedNodeIds.length} upstream caller(s) across ${branchPaths.length || 1} dependency branch(es).`;
  }

  const resilienceRecommendation =
    targetNode.type === "database"
      ? `Add Redis in-memory cache and read replicas to buffer read queries if ${targetNode.name} is unavailable.`
      : targetNode.type === "cache"
      ? `Configure cache bypass fallback in application services to query underlying persistence directly when ${targetNode.name} fails.`
      : targetNode.type === "queue"
      ? `Configure dead-letter queues (DLQ) and persistent message spooling for ${targetNode.name}.`
      : `Introduce circuit breakers and fallback default responses to isolate failure of ${targetNode.name}.`;

  return {
    sourceNodeId: targetNode.id,
    sourceNodeName: targetNode.name,
    directlyAffectedNodeIds,
    indirectlyAffectedNodeIds,
    affectedEdgeIds: Array.from(new Set(affectedEdgeIds)),
    operatingNodeIds,
    cascadingChain,
    explanation,
    resilienceRecommendation,
  };
}
