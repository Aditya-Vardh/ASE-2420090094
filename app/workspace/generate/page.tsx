"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ChevronDown, ChevronUp, Layers, PanelRight, Sparkles, Wand2, RefreshCw } from "lucide-react";
import AIGenerationPanel from "@/components/workspace/AIGenerationPanel";
import LoadingSequence from "@/components/workspace/LoadingSequence";
import ArchitectureCanvas from "@/components/workspace/ArchitectureCanvas";
import PropertyInspector from "@/components/workspace/PropertyInspector";
import AIAssistantDock from "@/components/workspace/AIAssistantDock";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import { DIAGRAM_TYPE_LABELS, type ArchitectureResult, type DiagramType } from "@/lib/storage/types";
import {
  addHistoryEntry,
  createProject,
  generateId,
  getActiveProjectId,
  getProject,
  getSettings,
  saveProject,
  setActiveProjectId,
} from "@/lib/storage/store";
import { getTemplate } from "@/lib/templates";
import { toMarkdownExport, downloadText } from "@/lib/export";

function GenerateContent() {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState("Untitled Architecture");
  const [prompt, setPrompt] = useState("");
  const [diagramType, setDiagramType] = useState<DiagramType>("architecture");
  const [result, setResult] = useState<ArchitectureResult | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [editPromptOpen, setEditPromptOpen] = useState(true);

  useEffect(() => {
    const settings = getSettings();
    const templateId = searchParams.get("template");
    const projectParam = searchParams.get("project");
    const isNew = searchParams.get("new");
    const typeParam = searchParams.get("type") as DiagramType | null;
    const validTypes: DiagramType[] = [
      "class", "sequence", "er", "flowchart", "component", "deployment", "state", "architecture",
    ];
    const typeFromUrl = typeParam && validTypes.includes(typeParam) ? typeParam : null;

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

    if (projectParam) {
      const project = getProject(projectParam);
      if (project) {
        setActiveProjectId(project.id);
        setProjectId(project.id);
        setTitle(project.title);
        setPrompt(project.prompt);
        setDiagramType(project.diagramType);
        setResult(project.result ?? null);
        if (project.result) setEditPromptOpen(false);
        return;
      }
    }

    if (isNew) {
      const dt = typeFromUrl ?? settings.defaultDiagramType;
      const project = createProject({
        title: typeFromUrl && typeFromUrl !== "architecture" ? `${typeFromUrl} Diagram` : "Untitled Architecture",
        prompt: "",
        diagramType: dt,
      });
      setProjectId(project.id);
      setDiagramType(dt);
      setTitle(project.title);
      setResult(null);
      setEditPromptOpen(true);
      return;
    }

    const activeId = getActiveProjectId();
    if (activeId) {
      const project = getProject(activeId);
      if (project) {
        setProjectId(project.id);
        setTitle(project.title);
        setPrompt(project.prompt);
        setDiagramType(project.diagramType);
        setResult(project.result ?? null);
        if (project.result) setEditPromptOpen(false);
        return;
      }
    }

    const dt = typeFromUrl ?? settings.defaultDiagramType;
    const project = createProject({ title: "Untitled Architecture", prompt: "", diagramType: dt });
    setProjectId(project.id);
    setDiagramType(dt);
  }, [searchParams]);

  const persistProject = useCallback(
    (updates: { title?: string; prompt?: string; diagramType?: DiagramType; result?: ArchitectureResult }) => {
      if (!projectId) return;
      const existing = getProject(projectId);
      if (!existing) return;
      saveProject({ ...existing, ...updates, updatedAt: new Date().toISOString() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [projectId],
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
            ? { refineInstruction, currentArchitecture: result }
            : { idea: prompt, diagramType },
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "We couldn't generate your architecture right now.");
        addHistoryEntry({
          id: generateId(), projectId: projectId ?? "unknown", projectTitle: title,
          prompt: refineInstruction ?? prompt, diagramType, status: "error",
          error: data.error, createdAt: new Date().toISOString(),
        });
        return data.error ?? null;
      }

      const architecture = data as ArchitectureResult;
      setResult(architecture);
      setTitle(architecture.title);
      setEditPromptOpen(false);

      if (projectId) {
        persistProject({ title: architecture.title, prompt, diagramType: architecture.diagramType, result: architecture });
      }

      addHistoryEntry({
        id: generateId(), projectId: projectId ?? "unknown", projectTitle: architecture.title,
        prompt: refineInstruction ?? prompt, diagramType: architecture.diagramType,
        status: "success", result: architecture, createdAt: new Date().toISOString(),
      });

      return `Architecture updated: ${architecture.title}`;
    } catch {
      setError("Network error. Check your connection and try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    if (!result) return;
    downloadText(toMarkdownExport(result), `${result.title.replace(/\s+/g, "-").toLowerCase()}.md`, "text/markdown");
  }

  function handleFullscreen() {
    canvasRef.current?.querySelector("[data-diagram-root]")?.requestFullscreen?.();
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0a0b04]">
      {/* Top Header */}
      <WorkspaceHeader
        title={title}
        onTitleChange={(v) => { setTitle(v); persistProject({ title: v }); }}
        diagramType={diagramType}
        saved={saved}
        onExport={result ? handleExport : undefined}
        onFullscreen={result ? handleFullscreen : undefined}
      />

      {/* Main Content Area */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {!result ? (
          /* INITIAL VIEW: Centered main Describe Box with neat top padding */
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex items-start justify-center pt-8 sm:pt-12 pb-20">
            <div className="w-full max-w-4xl space-y-6">
              <AIGenerationPanel
                prompt={prompt}
                onPromptChange={(v) => { setPrompt(v); persistProject({ prompt: v }); }}
                diagramType={diagramType}
                onDiagramTypeChange={(v) => { setDiagramType(v); persistProject({ diagramType: v }); }}
                loading={loading}
                onGenerate={() => generate()}
              />

              {loading && <LoadingSequence active={loading} />}

              {error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                    <div>
                      <h3 className="font-bold text-white">Generation Failed</h3>
                      <p className="text-xs">{error}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => generate()}
                    className="mt-3 rounded-xl bg-rose-500/20 px-4 py-1.5 text-xs font-bold text-white border border-rose-500/40"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* GENERATED VIEW: Canvas is Main, Prompt collapsible at top, Context Panel toggleable */
          <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
            {/* Top Prompt Action Bar */}
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
                    onClick={() => generate()}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#dddb9d]/20 bg-[#dddb9d]/10 px-3.5 py-1.5 text-xs font-bold text-[#7bc963] hover:bg-[#7bc963] hover:text-[#0a0b04] transition-all"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    Regenerate
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInspector(!showInspector)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
                      showInspector
                        ? "border-[#7bc963] bg-[#7bc963] text-[#0a0b04]"
                        : "border-[#dddb9d]/20 bg-[#12140a] text-[#f2f1da] hover:border-[#dddb9d]/40"
                    }`}
                  >
                    <PanelRight className="h-4 w-4" />
                    <span>{showInspector ? "Hide Inspector" : "Context Inspector"}</span>
                  </button>
                </div>
              </div>

              {editPromptOpen && (
                <div className="mt-4 pt-4 border-t border-[#dddb9d]/15 animate-fade-in space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#7bc963] flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5" /> Modify Architecture Specification Prompt
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#8e8c6c]">Diagram Spec:</span>
                      <select
                        value={diagramType}
                        onChange={(e) => {
                          const v = e.target.value as DiagramType;
                          setDiagramType(v);
                          persistProject({ diagramType: v });
                        }}
                        className="rounded-xl border border-[#dddb9d]/20 bg-[#070804] px-3 py-1.5 text-xs font-bold text-[#f2f1da] outline-none"
                      >
                        {(Object.entries(DIAGRAM_TYPE_LABELS) as [DiagramType, string][]).map(([v, l]) => (
                          <option key={v} value={v} className="bg-[#12140a]">{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => {
                        setPrompt(e.target.value);
                        persistProject({ prompt: e.target.value });
                      }}
                      rows={3}
                      placeholder="Describe architectural modifications, caching strategies, microservices, or database updates..."
                      className="w-full resize-none rounded-2xl border border-[#dddb9d]/20 bg-[#070804] p-4 text-xs leading-relaxed text-[#f2f1da] placeholder-[#8e8c6c] outline-none focus:border-[#7bc963]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#8e8c6c]">Press Cmd+Enter or click Regenerate to update diagram.</span>
                    <button
                      type="button"
                      onClick={() => generate()}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-5 py-2 text-xs font-bold text-[#0a0b04] shadow-[0_0_20px_rgba(123,201,99,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      <Wand2 className="h-3.5 w-3.5" />
                      <span>Synthesize Updated Canvas</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Main */}
            <div className="relative flex-1 min-h-0 overflow-hidden" ref={canvasRef}>
              <ArchitectureCanvas
                chart={result.mermaidCode}
                result={result}
                onRegenerate={() => generate()}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
              />
            </div>
          </div>

        )}

        {/* Toggleable Context Inspector Drawer */}
        {result && showInspector && (
          <aside className="w-80 sm:w-96 border-l border-[#dddb9d]/15 bg-[#12140a]/95 backdrop-blur-2xl overflow-y-auto">
            <PropertyInspector
              result={result}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onRefine={(instruction) => generate(instruction)}
              loading={loading}
              className="h-full"
            />
          </aside>
        )}
      </div>

      <AIAssistantDock onAsk={(q) => generate(q)} loading={loading} projectTitle={title} />
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#c8c69d]">Loading workspace…</div>}>
      <GenerateContent />
    </Suspense>
  );
}
