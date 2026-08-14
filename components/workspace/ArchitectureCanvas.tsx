"use client";

import {
  Copy, Check, Download, Image as ImageIcon, Code2, Network,
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Expand, FileText, FileType,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import type { ArchitectureResult } from "@/lib/storage/types";
import { downloadText, svgToPng, svgToPdf, toMarkdownExport } from "@/lib/export";
import { renderMermaidSafe } from "@/lib/mermaid-repair";
import GlassSurface from "@/components/ui/GlassSurface";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    nodeSpacing: 60,
    rankSpacing: 70,
    padding: 20,
    useMaxWidth: true,
  },
  themeVariables: {
    primaryColor: "#12140a",
    primaryTextColor: "#f2f1da",
    primaryBorderColor: "#7bc963",
    lineColor: "#7bc963",
    secondaryColor: "#0d0f06",
    tertiaryColor: "#0a0b04",
    mainBkg: "#070804",
    nodeBorder: "#7bc963",
    clusterBkg: "#12140a",
    clusterBorder: "#dddb9d",
    titleColor: "#dddb9d",
    edgeLabelBackground: "#0a0b04",
    actorBkg: "#12140a",
    actorBorder: "#7bc963",
    actorTextColor: "#f2f1da",
    signalColor: "#7bc963",
    signalTextColor: "#f2f1da",
    labelBoxBkgColor: "#12140a",
    labelBoxBorderColor: "#dddb9d",
    labelTextColor: "#f2f1da",
  },
});

type Props = {
  chart: string;
  result?: ArchitectureResult;
  onRegenerate?: () => void;
  selectedComponent?: string | null;
  onSelectComponent?: (name: string | null) => void;
};

export default function ArchitectureCanvas({
  chart, result, onRegenerate, selectedComponent, onSelectComponent,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"diagram" | "code">("diagram");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repairedChart, setRepairedChart] = useState(chart);
  const [svgContent, setSvgContent] = useState("");
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  useEffect(() => {
    async function render() {
      if (!diagramRef.current || view !== "diagram") return;
      setError(null);
      setSvgContent("");
      try {
        const type = result?.diagramType ?? "architecture";
        const { svg, repaired } = await renderMermaidSafe(mermaid, chart, type);
        setRepairedChart(repaired);
        setSvgContent(svg);
        diagramRef.current.innerHTML = svg;
        setScale(1);

        if (onSelectComponent) {
          diagramRef.current.querySelectorAll("[id]").forEach((el) => {
            el.addEventListener("click", (e) => {
              e.stopPropagation();
              const text = el.textContent?.trim();
              if (text) onSelectComponent(text);
            });
          });
        }
      } catch (err) {
        console.error(err);
        setError("Diagram render failed. View source or regenerate.");
        if (diagramRef.current) diagramRef.current.innerHTML = "";
      }
    }
    render();
  }, [chart, view, result?.diagramType, onSelectComponent]);

  const copyCode = useCallback(async () => {
    await navigator.clipboard.writeText(repairedChart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [repairedChart]);

  async function toggleFullscreen() {
    if (!rootRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await rootRef.current.requestFullscreen();
  }

  function onPointerDown(e: React.PointerEvent) {
    if (view !== "diagram" || !viewportRef.current) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, scrollLeft: viewportRef.current.scrollLeft, scrollTop: viewportRef.current.scrollTop };
    viewportRef.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isPanning || !viewportRef.current) return;
    viewportRef.current.scrollLeft = panStart.current.scrollLeft - (e.clientX - panStart.current.x);
    viewportRef.current.scrollTop = panStart.current.scrollTop - (e.clientY - panStart.current.y);
  }

  function onPointerUp(e: React.PointerEvent) {
    setIsPanning(false);
    viewportRef.current?.releasePointerCapture(e.pointerId);
  }

  return (
    <GlassSurface variant="canvas" className="architecture-canvas" ref={rootRef} data-diagram-root>
      <div className="canvas-viewport-wrap">
        {view === "diagram" ? (
          error ? (
            <div className="canvas-error">
              <h3>Architecture generation failed</h3>
              <p>{error}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setView("code")} className="inspector-action tone-cyan">View source</button>
                {onRegenerate && <button type="button" onClick={onRegenerate} className="inspector-action tone-violet">Try again</button>}
              </div>
            </div>
          ) : (
            <div
              ref={viewportRef}
              className={`canvas-viewport ${isPanning ? "is-panning" : ""}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <div ref={diagramRef} style={{ transform: `scale(${scale})`, transformOrigin: "top left" }} className="canvas-diagram" />
            </div>
          )
        ) : (
          <div className="canvas-source-editor">
            <textarea
              value={repairedChart}
              readOnly
              className="source-textarea"
              aria-label="Mermaid source"
            />
          </div>
        )}
      </div>

      <div className="floating-toolbar">
        <ToolbarGroup>
          <TBtn icon={Network} active={view === "diagram"} onClick={() => setView("diagram")} title="Diagram" />
          <TBtn icon={Code2} active={view === "code"} onClick={() => setView("code")} title="Source" />
        </ToolbarGroup>
        <ToolbarDivider />
        {view === "diagram" && (
          <ToolbarGroup>
            <TBtn icon={ZoomOut} onClick={() => setScale((s) => Math.max(s - 0.25, 0.25))} title="Zoom out" />
            <TBtn icon={ZoomIn} onClick={() => setScale((s) => Math.min(s + 0.25, 3))} title="Zoom in" />
            <TBtn icon={Maximize2} onClick={() => { setScale(1); viewportRef.current?.scrollTo({ left: 0, top: 0, behavior: "smooth" }); }} title="Fit" />
            <TBtn icon={RotateCcw} onClick={() => setScale(1)} title="Reset" />
            <TBtn icon={Expand} onClick={toggleFullscreen} title="Fullscreen" />
          </ToolbarGroup>
        )}
        <ToolbarDivider />
        <ToolbarGroup>
          <TBtn icon={copied ? Check : Copy} onClick={copyCode} title="Copy" />
          <TBtn icon={Download} onClick={() => svgContent && downloadText(svgContent, "diagram.svg", "image/svg+xml")} title="SVG" disabled={!svgContent} />
          <TBtn icon={ImageIcon} onClick={() => svgContent && svgToPng(svgContent, "diagram.png")} title="PNG" disabled={!svgContent} />
          <TBtn icon={FileType} onClick={() => svgContent && svgToPdf(svgContent, "diagram.pdf")} title="PDF" disabled={!svgContent} />
          {result && <TBtn icon={FileText} onClick={() => downloadText(toMarkdownExport(result), "architecture.md", "text/markdown")} title="Markdown" />}
          {onRegenerate && <TBtn icon={RotateCcw} onClick={onRegenerate} title="Regenerate" />}
        </ToolbarGroup>
      </div>

      {selectedComponent && (
        <div className="canvas-selection-badge">{selectedComponent}</div>
      )}

      <div className="arch-legend absolute left-3 bottom-14 z-[5] hidden sm:flex rounded-lg border border-border bg-surface-glass-strong/90 backdrop-blur-md">
        {[
          { label: "Frontend", color: "var(--arch-frontend)" },
          { label: "Backend", color: "var(--arch-backend)" },
          { label: "Data", color: "var(--arch-database)" },
          { label: "AI", color: "var(--arch-ai)" },
          { label: "Infra", color: "var(--arch-infra)" },
        ].map((l) => (
          <span key={l.label} className="arch-legend-item">
            <span className="arch-legend-dot" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </GlassSurface>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="toolbar-group">{children}</div>;
}

function ToolbarDivider() {
  return <div className="toolbar-divider" />;
}

function TBtn({ icon: Icon, onClick, title, active, disabled }: { icon: LucideIcon; onClick: () => void; title: string; active?: boolean; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} title={title} disabled={disabled} className={`toolbar-btn ${active ? "toolbar-btn-active" : ""}`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}
