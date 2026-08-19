"use client";

import {
  Copy, Check, ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon, FileType,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import type { ArchitectureResult } from "@/lib/storage/types";
import { downloadText, svgToPng, svgToPdf, toMarkdownExport } from "@/lib/export";
import { renderMermaidSafe } from "@/lib/mermaid-repair";

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
  highlightedNodeIds?: string[];
  onSelectComponent?: (name: string | null) => void;
};

export default function ArchitectureCanvas({
  chart, result, onRegenerate, selectedComponent, highlightedNodeIds = [], onSelectComponent,
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
  const renderAbortRef = useRef<AbortController | null>(null);

  const setupNodeListeners = useCallback(() => {
    if (!diagramRef.current || !onSelectComponent) return;

    const nodeElements = diagramRef.current.querySelectorAll(
      ".node, g[id*='flowchart-'], g.nodeGroup, g.cluster"
    );

    nodeElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.cursor = "pointer";
      htmlEl.onclick = (e) => {
        e.stopPropagation();
        const text = htmlEl.textContent?.trim();
        if (text) onSelectComponent(text);
      };
    });
  }, [onSelectComponent]);

  useEffect(() => {
    if (view !== "diagram") return;

    const abort = new AbortController();
    renderAbortRef.current = abort;

    async function render() {
      setError(null);
      setSvgContent("");

      let svgEl: HTMLDivElement | null = null;

      try {
        const type = result?.diagramType ?? "architecture";
        const { svg, repaired } = await renderMermaidSafe(mermaid, chart, type);

        if (abort.signal.aborted) return;

        setRepairedChart(repaired);
        setSvgContent(svg);

        svgEl = diagramRef.current;
        if (!svgEl) return;
        svgEl.innerHTML = svg;
        setScale(1);
        setupNodeListeners();
      } catch (err) {
        if (abort.signal.aborted) return;
        console.error("[ArchitectureCanvas] render error:", err);
        setError("Diagram render failed. View source or regenerate.");
        if (diagramRef.current) diagramRef.current.innerHTML = "";
      }
    }

    render();

    return () => {
      abort.abort();
    };
  }, [chart, result, view, setupNodeListeners]);

  useEffect(() => {
    if (!diagramRef.current) return;

    const allNodes = diagramRef.current.querySelectorAll(".node, g[id*='flowchart-']");
    allNodes.forEach((nodeEl) => {
      const htmlEl = nodeEl as HTMLElement;
      const text = htmlEl.textContent?.trim().toLowerCase() || "";
      const isSelected = selectedComponent && text.includes(selectedComponent.toLowerCase());
      const isHighlighted = highlightedNodeIds.some((id) => text.includes(id.toLowerCase()));

      if (isSelected || isHighlighted) {
        htmlEl.style.outline = "2px solid #7bc963";
        htmlEl.style.outlineOffset = "4px";
        htmlEl.style.filter = "drop-shadow(0 0 12px rgba(123,201,99,0.8))";
      } else {
        htmlEl.style.outline = "none";
        htmlEl.style.filter = "none";
      }
    });
  }, [selectedComponent, highlightedNodeIds, svgContent]);

  function handleCopy() {
    navigator.clipboard.writeText(repairedChart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExportPng() {
    if (svgContent) {
      svgToPng(svgContent, `${(result?.title || "architecture").toLowerCase().replace(/\s+/g, "-")}.png`);
    }
  }

  function handleExportPdf() {
    if (svgContent) {
      svgToPdf(svgContent, `${(result?.title || "architecture").toLowerCase().replace(/\s+/g, "-")}.pdf`);
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#070804]" ref={rootRef}>
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#dddb9d]/15 bg-[#12140a]/90 px-4 backdrop-blur-xl z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView("diagram")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${view === "diagram" ? "bg-[#7bc963] text-[#0a0b04]" : "text-[#c8c69d] hover:text-[#f2f1da]"
              }`}
          >
            Diagram View
          </button>
          <button
            type="button"
            onClick={() => setView("code")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${view === "code" ? "bg-[#7bc963] text-[#0a0b04]" : "text-[#c8c69d] hover:text-[#f2f1da]"
              }`}
          >
            Mermaid Source
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2, s + 0.15))}
            className="rounded-lg border border-[#dddb9d]/15 bg-[#070804] p-1.5 text-[#c8c69d] hover:text-[#f2f1da]"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.25, s - 0.15))}
            className="rounded-lg border border-[#dddb9d]/15 bg-[#070804] p-1.5 text-[#c8c69d] hover:text-[#f2f1da]"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setScale(1)}
            className="rounded-lg border border-[#dddb9d]/15 bg-[#070804] p-1.5 text-[#c8c69d] hover:text-[#f2f1da]"
            title="Reset Zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <div className="h-4 w-[1px] bg-[#dddb9d]/15 mx-1" />

          <button
            type="button"
            onClick={handleExportPng}
            className="flex items-center gap-1.5 rounded-lg border border-[#dddb9d]/15 bg-[#070804] px-2.5 py-1.5 text-xs font-bold text-[#c8c69d] hover:text-[#f2f1da]"
          >
            <ImageIcon className="h-3.5 w-3.5" /> PNG
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 rounded-lg border border-[#dddb9d]/15 bg-[#070804] px-2.5 py-1.5 text-xs font-bold text-[#c8c69d] hover:text-[#f2f1da]"
          >
            <FileType className="h-3.5 w-3.5" /> PDF
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-auto p-8"
        ref={viewportRef}
        onMouseDown={(e) => {
          if (e.target === viewportRef.current || e.target === diagramRef.current) {
            setIsPanning(true);
            panStart.current = { x: e.clientX, y: e.clientY, scrollLeft: viewportRef.current?.scrollLeft || 0, scrollTop: viewportRef.current?.scrollTop || 0 };
          }
        }}
        onMouseMove={(e) => {
          if (isPanning && viewportRef.current) {
            viewportRef.current.scrollLeft = panStart.current.scrollLeft - (e.clientX - panStart.current.x);
            viewportRef.current.scrollTop = panStart.current.scrollTop - (e.clientY - panStart.current.y);
          }
        }}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
      >
        {selectedComponent && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full border border-[#7bc963]/40 bg-[#12140a]/90 px-3.5 py-1 backdrop-blur-md shadow-[0_0_20px_rgba(123,201,99,0.3)]">
            <span className="h-2 w-2 rounded-full bg-[#7bc963]" />
            <span className="font-mono text-xs font-bold text-[#7bc963]">Selected: {selectedComponent}</span>
            <button type="button" onClick={() => onSelectComponent?.(null)} className="text-[#8e8c6c] hover:text-[#f2f1da]">
              ×
            </button>
          </div>
        )}

        {view === "diagram" ? (
          <div
            ref={diagramRef}
            className="flex min-h-full min-w-full items-center justify-center transition-transform duration-150"
            style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
          />
        ) : (
          <div className="h-full w-full max-w-4xl mx-auto space-y-4">
            <div className="flex justify-end">
              <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 rounded-xl bg-[#7bc963] px-3.5 py-1.5 text-xs font-bold text-[#0a0b04]">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Copied Source" : "Copy Mermaid Source"}</span>
              </button>
            </div>
            <pre className="rounded-2xl border border-[#dddb9d]/20 bg-[#12140a] p-6 text-xs font-mono text-[#c8c69d] overflow-x-auto whitespace-pre-wrap">
              {repairedChart}
            </pre>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#070804]/90 p-6 text-center">
            <div className="max-w-md space-y-4">
              <p className="text-sm text-rose-300 font-bold">{error}</p>
              {onRegenerate && (
                <button type="button" onClick={onRegenerate} className="rounded-xl bg-[#7bc963] px-5 py-2 text-xs font-bold text-[#0a0b04]">
                  Regenerate Diagram
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
