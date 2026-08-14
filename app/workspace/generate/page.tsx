"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ChevronDown, ChevronUp, Layers, PanelRight, Sparkles, Wand2, RefreshCw, Zap, Cpu, Code2, AlertTriangle, CheckCircle2 } from "lucide-react";
import AIGenerationPanel from "@/components/workspace/AIGenerationPanel";
import LoadingSequence from "@/components/workspace/LoadingSequence";
import ArchitectureCanvas from "@/components/workspace/ArchitectureCanvas";
import PropertyInspector from "@/components/workspace/PropertyInspector";
import AIAssistantDock from "@/components/workspace/AIAssistantDock";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import ComparisonModal from "@/components/workspace/ComparisonModal";
import ArchitectureSimulator from "@/components/workspace/ArchitectureSimulator";
import ArtifactsModal from "@/components/workspace/ArtifactsModal";
import ComponentDetailModal from "@/components/workspace/ComponentDetailModal";
import GuidedJourneyModal from "@/components/workspace/GuidedJourneyModal";

import { DIAGRAM_TYPE_LABELS, type ArchitectureResult, type DiagramType } from "@/lib/storage/types";
import {
  addHistoryEntry, createProject, generateId, getActiveProjectId, getProject, getSettings, saveProject, setActiveProjectId,
} from "@/lib/storage/store";
import { getTemplate } from "@/lib/templates";
import { toMarkdownExport, downloadText } from "@/lib/export";
import { parseMermaidToGraph } from "@/lib/graph/parser";
import { graphToMermaid, addCacheToGraph, addGatewayToGraph, improveComponentInGraph } from "@/lib/graph/serializer";
import { optimizeArchitecture } from "@/lib/optimizer/optimizer";
import { evaluateArchitectureScore } from "@/lib/analysis/scoring";
import { analyzeArchitectureRisks } from "@/lib/analysis/risk";
import type { ArchitectureGraph, OptimizationResult, ArchNode } from "@/lib/graph/types";

function GenerateContent() {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState("Untitled Architecture");
  const [prompt, setPrompt] = useState("");
  const [diagramType, setDiagramType] = useState<DiagramType>("architecture");
  const [result, setResult] = useState<ArchitectureResult | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [editPromptOpen, setEditPromptOpen] = useState(true);

  // Active Canonical ArchitectureGraph
  const [activeGraph, setActiveGraph] = useState<ArchitectureGraph | null>(null);

  // Modals state
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [detailNode, setDetailNode] = useState<ArchNode | null>(null);

  // AI Confirmation Modal State
  const [pendingMutation, setPendingMutation] = useState<{ type: string; targetId?: string; title: string; desc: string } | null>(null);

  useEffect(() => {
    const settings = getSettings();
    const templateId = searchParams.get("template");
    const projectParam = searchParams.get("project");
    const isNew = searchParams.get("new");
    const isJourney = searchParams.get("journey") === "1";
    const typeParam = searchParams.get("type") as DiagramType | null;
    const validTypes: DiagramType[] = [
      "class", "sequence", "er", "flowchart", "component", "deployment", "state", "architecture",
    ];
    const typeFromUrl = typeParam && validTypes.includes(typeParam) ? typeParam : null;

    if (isJourney) {
      setShowJourney(true);
    }

    if (templateId) {
      const template = getTemplate(templateId);
      if (template) {
        const project = createProject({ title: template.name, prompt: template.prompt, diagramType: template.diagramType });
        setProjectId(project.id);
        setTitle(project.title);
        setPrompt(project.prompt);
        setDiagramType(project.diagramType);
        return;
      }
    }

    if (isNew === "1") {
      setProjectId(null);
      setTitle("Untitled Architecture");
      setPrompt("");
      setResult(null);
      setActiveGraph(null);
      setSelectedComponent(null);
      setShowInspector(false);
      setDiagramType(typeFromUrl ?? settings.defaultDiagramType);
      return;
    }

    const targetId = projectParam || getActiveProjectId();
    if (targetId) {
      const project = getProject(targetId);
      if (project) {
        setProjectId(project.id);
        setTitle(project.title);
        setPrompt(project.prompt);
        setDiagramType(project.diagramType);
        if (project.result) {
          setResult(project.result);
          const parsed = parseMermaidToGraph(project.result.mermaidCode, project.result.diagramType, project.result.title, project.result.explanation.components, project.result.technologies);
          setActiveGraph(parsed);
          setShowInspector(true);
          setEditPromptOpen(false);
        }
      }
    }
  }, [searchParams]);

  const commitGraphUpdate = useCallback(
    (newGraph: ArchitectureGraph, customResult?: ArchitectureResult) => {
      setActiveGraph(newGraph);
      const generatedMermaid = graphToMermaid(newGraph);
      const score = evaluateArchitectureScore(newGraph);
      const risks = analyzeArchitectureRisks(newGraph);

      const updatedResult: ArchitectureResult = customResult || {
        title: newGraph.title,
        diagramType: newGraph.diagramType,
        mermaidCode: generatedMermaid,
        explanation: result?.explanation || {
          overview: `Production specification for ${newGraph.title}.`,
          components: newGraph.nodes.map((n) => ({ name: n.name, description: n.description })),
          dataFlow: "HTTP / Ingress -> Microservices -> Persistence",
          technologyChoices: newGraph.nodes.map((n) => n.technology).join(", "),
          scalability: score.scalability.reason,
          security: score.security.reason,
          reliability: score.reliability.reason,
          tradeoffs: "Decoupled architecture balances scalability with service tracing overhead.",
          improvements: "Add distributed tracing and multi-region read replicas.",
        },
        technologies: Array.from(new Set(newGraph.nodes.map((n) => n.technology))),
        adaptiveInsights: {
          health: score.overall,
          healthLabel: score.label,
          scalability: score.scalability.score,
          maintainability: score.maintainability.score,
          reliability: score.reliability.score,
          security: score.security.score,
          adaptability: score.coupling.score,
          potentialIssues: risks.map((r) => r.title),
          suggestions: risks.map((r) => ({ current: r.title, suggested: r.recommendedSolution, reason: r.whyItMatters, category: "scalability" })),
        },
      };

      setResult(updatedResult);
      setTitle(newGraph.title);

      if (projectId) {
        saveProject({ id: projectId, title: newGraph.title, description: "", prompt, diagramType: newGraph.diagramType, result: updatedResult, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      } else {
        const created = createProject({ title: newGraph.title, prompt, diagramType: newGraph.diagramType, result: updatedResult });
        setProjectId(created.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [projectId, prompt, result]
  );

  async function generate(refineInstruction?: string): Promise<string | null> {
    if (!refineInstruction && prompt.trim().length < 15) return null;
    if (loading) return null;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          refineInstruction
            ? { refineInstruction, currentArchitecture: result, diagramType }
            : { idea: prompt, diagramType },
        ),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "We couldn't generate your architecture right now.");
        return data.error ?? null;
      }

      const architecture = data as ArchitectureResult;
      const parsedGraph = parseMermaidToGraph(architecture.mermaidCode, architecture.diagramType, architecture.title, architecture.explanation.components, architecture.technologies);

      commitGraphUpdate(parsedGraph, architecture);
      setShowInspector(true);
      setEditPromptOpen(false);

      addHistoryEntry({
        id: generateId(),
        projectId: projectId ?? "unknown",
        projectTitle: architecture.title,
        prompt: refineInstruction ?? prompt,
        diagramType: architecture.diagramType,
        status: "success",
        result: architecture,
        createdAt: new Date().toISOString(),
      });

      return `Architecture updated: ${architecture.title}`;
    } catch {
      setError("Network error. Check your connection and try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  function handleOptimize() {
    if (!activeGraph) return;
    const optRes = optimizeArchitecture(activeGraph);
    setOptimizationResult(optRes);
  }

  function handleApplyOptimized() {
    if (!optimizationResult) return;
    commitGraphUpdate(optimizationResult.optimizedGraph);
    setOptimizationResult(null);
  }

  function handleExecuteMutation(type: string, targetId?: string) {
    if (!activeGraph) return;
    if (type === "ADD_CACHE") {
      const targetName = targetId || activeGraph.nodes.find((n) => n.type === "database")?.name || activeGraph.nodes[0]?.name;
      const mutated = addCacheToGraph(activeGraph, targetName);
      commitGraphUpdate(mutated);
    } else if (type === "ADD_GATEWAY") {
      const mutated = addGatewayToGraph(activeGraph);
      commitGraphUpdate(mutated);
    } else if (type === "IMPROVE_COMPONENT" && targetId) {
      const mutated = improveComponentInGraph(activeGraph, targetId, "Added multi-region auto-scaling and connection pool isolation.");
      commitGraphUpdate(mutated);
    }
    setPendingMutation(null);
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0a0b04] text-[#f2f1da]">
      <WorkspaceHeader
        title={title}
        onTitleChange={(v) => { setTitle(v); if (activeGraph) commitGraphUpdate({ ...activeGraph, title: v }); }}
        diagramType={diagramType}
        saved={saved}
        onExport={() => result && downloadText(toMarkdownExport(result), `${title.toLowerCase().replace(/\s+/g, "-")}.md`)}
        onFullscreen={() => canvasRef.current?.requestFullscreen()}
      />

      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        {!result ? (
          <div className="flex flex-1 items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-2xl space-y-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowJourney(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#7bc963]/40 bg-[#7bc963]/10 px-4 py-2.5 text-xs font-bold text-[#7bc963] hover:bg-[#7bc963] hover:text-[#0a0b04] transition-all shadow-[0_0_20px_rgba(123,201,99,0.2)]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>✨ Launch Guided Journey</span>
                </button>
              </div>

              <AIGenerationPanel
                prompt={prompt}
                onPromptChange={setPrompt}
                diagramType={diagramType}
                onDiagramTypeChange={setDiagramType}
                onGenerate={() => generate()}
                loading={loading}
              />
              {loading && <LoadingSequence />}
              {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
            {/* Top Action & Prompt Bar */}
            <div className="shrink-0 border-b border-[#dddb9d]/15 bg-[#12140a]/90 px-6 py-3 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setEditPromptOpen(!editPromptOpen)}
                  className="flex items-center gap-2 text-xs font-bold text-[#f2f1da] hover:text-[#7bc963] transition-colors"
                >
                  <Wand2 className="h-4 w-4 text-[#7bc963]" />
                  <span>Prompt: <span className="font-mono text-[#c8c69d] font-normal truncate max-w-md inline-block align-bottom">{prompt}</span></span>
                  {editPromptOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowJourney(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#7bc963]/40 bg-[#7bc963]/10 px-3.5 py-1.5 text-xs font-bold text-[#7bc963] hover:bg-[#7bc963] hover:text-[#0a0b04] transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#7bc963]" />
                    <span>✨ Journey</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOptimize}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#7bc963]/40 bg-[#7bc963]/10 px-3.5 py-1.5 text-xs font-bold text-[#7bc963] hover:bg-[#7bc963] hover:text-[#0a0b04] transition-all shadow-[0_0_15px_rgba(123,201,99,0.2)]"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>✨ Optimize</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSimulator(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#dddb9d]/20 bg-[#12140a] px-3.5 py-1.5 text-xs font-bold text-[#f2f1da] hover:border-[#7bc963] transition-all"
                  >
                    <Cpu className="h-3.5 w-3.5 text-[#7bc963]" />
                    <span>Simulate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowArtifacts(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#dddb9d]/20 bg-[#12140a] px-3.5 py-1.5 text-xs font-bold text-[#c8c69d] hover:border-[#dddb9d]/40 transition-all"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>Artifacts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generate()}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#dddb9d]/20 bg-[#dddb9d]/10 px-3.5 py-1.5 text-xs font-bold text-[#c8c69d] hover:text-[#f2f1da] transition-all"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Regenerate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInspector(!showInspector)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
                      showInspector ? "border-[#7bc963] bg-[#7bc963] text-[#0a0b04]" : "border-[#dddb9d]/20 bg-[#12140a] text-[#f2f1da]"
                    }`}
                  >
                    <PanelRight className="h-4 w-4" />
                    <span>Inspector</span>
                  </button>
                </div>
              </div>

              {editPromptOpen && (
                <div className="mt-4 pt-4 border-t border-[#dddb9d]/15 space-y-3">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-[#dddb9d]/20 bg-[#070804] p-3 text-xs leading-relaxed text-[#f2f1da] outline-none focus:border-[#7bc963]"
                  />
                  <div className="flex justify-end">
                    <button type="button" onClick={() => generate()} disabled={loading} className="rounded-xl bg-[#7bc963] px-4 py-1.5 text-xs font-bold text-[#0a0b04]">
                      Synthesize Updated Architecture
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Main Canvas & Inspector Workspace */}
            <div className="relative flex flex-1 min-h-0 min-w-0 overflow-hidden">
              <div className="relative flex-1 min-h-0 overflow-hidden" ref={canvasRef}>
                <ArchitectureCanvas
                  chart={result.mermaidCode}
                  result={result}
                  onRegenerate={() => generate()}
                  selectedComponent={selectedComponent}
                  highlightedNodeIds={highlightedNodeIds}
                  onSelectComponent={(compName) => {
                    setSelectedComponent(compName);
                    if (compName && activeGraph) {
                      const found = activeGraph.nodes.find((n) => n.name.toLowerCase() === compName.toLowerCase() || n.id.toLowerCase() === compName.toLowerCase());
                      if (found) setDetailNode(found);
                    }
                  }}
                />
              </div>

              {/* Context Inspector Drawer */}
              {showInspector && (
                <aside className="w-80 sm:w-[380px] border-l border-[#dddb9d]/15 bg-[#12140a]/95 backdrop-blur-2xl overflow-y-auto shrink-0 h-full z-10">
                  <PropertyInspector
                    result={result}
                    graph={activeGraph}
                    selectedComponent={selectedComponent}
                    onSelectComponent={setSelectedComponent}
                    onRefine={(instruction) => generate(instruction)}
                    onOptimize={handleOptimize}
                    onSimulate={() => setShowSimulator(true)}
                    onArtifacts={() => setShowArtifacts(true)}
                    onSelectRiskNodes={(nodeIds) => {
                      setHighlightedNodeIds(nodeIds);
                      if (nodeIds.length > 0 && activeGraph) {
                        const matched = activeGraph.nodes.find((n) => nodeIds.includes(n.id));
                        if (matched) setSelectedComponent(matched.name);
                      }
                    }}
                    onApplyMutation={(type, targetId) => {
                      setPendingMutation({
                        type,
                        targetId,
                        title: `Confirm Graph Mutation (${type})`,
                        desc: `Executing this mutation will update ArchitectureGraph, re-evaluate health scores, and push a version snapshot.`,
                      });
                    }}
                    loading={loading}
                    className="h-full"
                  />
                </aside>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for AI Graph Mutations */}
      {pendingMutation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-3xl border border-[#dddb9d]/20 bg-[#0a0b04] p-6 space-y-4 text-[#f2f1da] shadow-2xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
              <h3 className="text-base font-bold">{pendingMutation.title}</h3>
            </div>
            <p className="text-xs text-[#c8c69d] leading-relaxed">{pendingMutation.desc}</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingMutation(null)}
                className="rounded-xl border border-[#dddb9d]/15 bg-[#12140a] px-4 py-2 text-xs font-bold text-[#c8c69d]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleExecuteMutation(pendingMutation.type, pendingMutation.targetId)}
                className="rounded-xl bg-[#7bc963] px-4 py-2 text-xs font-bold text-[#0a0b04]"
              >
                Confirm &amp; Apply Mutation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guided Journey Modal */}
      {showJourney && (
        <GuidedJourneyModal
          graph={activeGraph}
          onClose={() => setShowJourney(false)}
          onGeneratePrompt={async (pText) => {
            setPrompt(pText);
            await generate();
          }}
          onHighlightNodes={(nodeIds) => setHighlightedNodeIds(nodeIds)}
          onApplyOptimization={handleApplyOptimized}
          onOpenArtifacts={() => setShowArtifacts(true)}
          onOpenCopilot={() => {}}
        />
      )}

      {/* Modals */}
      {optimizationResult && (
        <ComparisonModal
          result={optimizationResult}
          onClose={() => setOptimizationResult(null)}
          onApplyOptimized={handleApplyOptimized}
        />
      )}

      {showSimulator && activeGraph && (
        <ArchitectureSimulator
          graph={activeGraph}
          onClose={() => setShowSimulator(false)}
          onHighlightBottlenecks={(bNodeIds) => {
            setHighlightedNodeIds(bNodeIds);
            const first = activeGraph.nodes.find((n) => bNodeIds.includes(n.id));
            if (first) setSelectedComponent(first.name);
          }}
        />
      )}

      {showArtifacts && activeGraph && (
        <ArtifactsModal
          graph={activeGraph}
          onClose={() => setShowArtifacts(false)}
        />
      )}

      {detailNode && activeGraph && (
        <ComponentDetailModal
          node={detailNode}
          graph={activeGraph}
          onClose={() => setDetailNode(null)}
        />
      )}

      <AIAssistantDock onAsk={(q) => generate(q)} loading={loading} projectTitle={title} />
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#c8c69d]">Loading Arqen workspace…</div>}>
      <GenerateContent />
    </Suspense>
  );
}
