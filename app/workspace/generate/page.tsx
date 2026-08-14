"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ChevronDown, ChevronUp, Layers, PanelRight, Sparkles } from "lucide-react";
import AIGenerationPanel from "@/components/workspace/AIGenerationPanel";
import LoadingSequence from "@/components/workspace/LoadingSequence";
import ArchitectureCanvas from "@/components/workspace/ArchitectureCanvas";
import PropertyInspector from "@/components/workspace/PropertyInspector";
import AIAssistantDock from "@/components/workspace/AIAssistantDock";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import type { ArchitectureResult, DiagramType } from "@/lib/storage/types";
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
  const [title, setTitle] = useState("Untitled Project");
  const [prompt, setPrompt] = useState("");
  const [diagramType, setDiagramType] = useState<DiagramType>("architecture");
  const [result, setResult] = useState<ArchitectureResult | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showMobileInspector, setShowMobileInspector] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

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
        if (project.result) setPanelCollapsed(true);
        return;
      }
    }

    if (isNew) {
      const dt = typeFromUrl ?? settings.defaultDiagramType;
      const project = createProject({
        title: typeFromUrl && typeFromUrl !== "architecture" ? `${typeFromUrl} Diagram` : "Untitled Project",
        prompt: "",
        diagramType: dt,
      });
      setProjectId(project.id);
      setDiagramType(dt);
      setTitle(project.title);
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
        if (project.result) setPanelCollapsed(true);
        return;
      }
    }

    const dt = typeFromUrl ?? settings.defaultDiagramType;
    const project = createProject({ title: "Untitled Project", prompt: "", diagramType: dt });
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
      setPanelCollapsed(true);

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
    <div className="workspace-shell">
      <WorkspaceHeader
        title={title}
        onTitleChange={(v) => { setTitle(v); persistProject({ title: v }); }}
        diagramType={diagramType}
        saved={saved}
        onExport={result ? handleExport : undefined}
        onFullscreen={result ? handleFullscreen : undefined}
      />

      <div className="workspace-main">
        <aside className={`generator-column ${panelCollapsed ? "generator-column-collapsed" : ""}`}>
          <div className="generator-column-header">
            <span className="text-xs font-medium uppercase tracking-wider text-subtle">Generator</span>
            <button
              type="button"
              onClick={() => setPanelCollapsed(!panelCollapsed)}
              className="header-icon-btn"
              title={panelCollapsed ? "Expand panel" : "Collapse panel"}
            >
              {panelCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          </div>

          {!panelCollapsed ? (
            <>
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
                <div className="error-panel">
                  <AlertCircle className="h-4 w-4 shrink-0 text-error" />
                  <div>
                    <h3>Architecture generation failed</h3>
                    <p>{error}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => generate()} className="inspector-action tone-violet">
                        Try Again
                      </button>
                      <button type="button" onClick={() => setPanelCollapsed(false)} className="inspector-action tone-cyan">
                        Edit Prompt
                      </button>
                      <details className="w-full">
                        <summary className="cursor-pointer text-xs text-subtle mt-1">View Details</summary>
                        <pre className="mt-1 whitespace-pre-wrap break-all text-[10px] text-muted font-mono">{error}</pre>
                      </details>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <AIGenerationPanel
              prompt={prompt}
              onPromptChange={(v) => { setPrompt(v); persistProject({ prompt: v }); }}
              diagramType={diagramType}
              onDiagramTypeChange={(v) => { setDiagramType(v); persistProject({ diagramType: v }); }}
              loading={loading}
              onGenerate={() => generate()}
              collapsed
            />
          )}
        </aside>

        <div className="canvas-column" ref={canvasRef}>
          {result && !loading ? (
            <ArchitectureCanvas
              chart={result.mermaidCode}
              result={result}
              onRegenerate={() => generate()}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
            />
          ) : (
            <div className="canvas-empty">
              <div className="canvas-empty-visual">
                <Layers className="h-10 w-10 text-cyan-400/50" />
                <div className="canvas-empty-grid" aria-hidden />
              </div>
              <h2>Your architecture canvas is ready</h2>
              <p>
                Describe your system and ArchiGen will map components, relationships,
                data flow, and infrastructure — then surface adaptive insights you can apply.
              </p>
              {!panelCollapsed && (
                <button type="button" onClick={() => generate()} disabled={loading || prompt.trim().length < 15} className="generate-btn-primary generate-btn-compact-inline">
                  <Sparkles className="h-4 w-4" />
                  Generate Architecture
                </button>
              )}
            </div>
          )}
        </div>

        <div className="inspector-column hidden xl:flex">
          <PropertyInspector
            result={result}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            onRefine={(instruction) => generate(instruction)}
            loading={loading}
            className="h-full"
          />
        </div>
      </div>

      <AIAssistantDock onAsk={(q) => generate(q)} loading={loading} projectTitle={title} />

      {showMobileInspector && (
        <div className="inspector-drawer xl:hidden">
          <button type="button" className="inspector-drawer-overlay" onClick={() => setShowMobileInspector(false)} aria-label="Close inspector" />
          <div className="inspector-drawer-panel">
            <PropertyInspector
              result={result}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onRefine={(instruction) => { generate(instruction); setShowMobileInspector(false); }}
              loading={loading}
              className="h-full"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowMobileInspector(true)}
        className="inspector-mobile-trigger xl:hidden"
        aria-label="Open inspector"
      >
        <PanelRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted">Loading workspace…</div>}>
      <GenerateContent />
    </Suspense>
  );
}
