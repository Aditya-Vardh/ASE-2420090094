import type { ArchitectureGraph } from "@/lib/graph/types";
import type { VersionDiffResult } from "./types";
import { evaluateUnifiedIntelligence } from "./engine";

export function compareArchitectureVersions(
  graphV1: ArchitectureGraph,
  graphV2: ArchitectureGraph
): VersionDiffResult {
  const intelV1 = evaluateUnifiedIntelligence(graphV1);
  const intelV2 = evaluateUnifiedIntelligence(graphV2);

  const nodesV1Names = new Set(graphV1.nodes.map((n) => n.name));
  const nodesV2Names = new Set(graphV2.nodes.map((n) => n.name));

  const addedNodeNames = Array.from(nodesV2Names).filter((name) => !nodesV1Names.has(name));
  const removedNodeNames = Array.from(nodesV1Names).filter((name) => !nodesV2Names.has(name));

  const modifiedNodeNames = graphV2.nodes
    .filter((n2) => {
      const n1 = graphV1.nodes.find((n) => n.id === n2.id || n.name === n2.name);
      return n1 && (n1.scalingStrategy !== n2.scalingStrategy || n1.technology !== n2.technology);
    })
    .map((n) => n.name);

  const titlesV1 = new Set(intelV1.findings.map((f) => f.title));
  const titlesV2 = new Set(intelV2.findings.map((f) => f.title));

  const resolvedFindingTitles = Array.from(titlesV1).filter((t) => !titlesV2.has(t));
  const newFindingTitles = Array.from(titlesV2).filter((t) => !titlesV1.has(t));

  return {
    v1Title: graphV1.title,
    v2Title: graphV2.title,
    healthDelta: intelV2.overallHealthScore - intelV1.overallHealthScore,
    securityDelta: intelV2.dimensionScores.security - intelV1.dimensionScores.security,
    reliabilityDelta: intelV2.dimensionScores.reliability - intelV1.dimensionScores.reliability,
    scalabilityDelta: intelV2.dimensionScores.scalability - intelV1.dimensionScores.scalability,
    addedNodeNames,
    removedNodeNames,
    modifiedNodeNames,
    resolvedFindingTitles,
    newFindingTitles,
  };
}
