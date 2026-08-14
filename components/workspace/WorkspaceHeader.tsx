"use client";

import { Check, Download, Maximize2, Sparkles, Layers } from "lucide-react";
import type { DiagramType } from "@/lib/storage/types";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";

type Props = {
  title: string;
  onTitleChange: (v: string) => void;
  diagramType: DiagramType;
  saved?: boolean;
  onExport?: () => void;
  onFullscreen?: () => void;
};

export default function WorkspaceHeader({
  title, onTitleChange, diagramType, saved, onExport, onFullscreen,
}: Props) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#070810]/90 px-4 sm:px-6 backdrop-blur-2xl">
      {/* Left Title Input */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
          <Layers className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="rounded-xl border border-transparent bg-transparent px-2.5 py-1 text-sm font-bold text-white transition-colors hover:border-white/10 focus:border-cyan-400/50 focus:bg-[#0A0C14] outline-none"
          aria-label="Project name"
        />
        {saved && (
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            <Check className="h-3 w-3" /> Auto-Saved
          </span>
        )}
      </div>

      {/* Center Studio Pill */}
      <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-slate-300">
        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
        <span>ArchiGen AI Studio Canvas</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-indigo-300">
          {DIAGRAM_TYPE_LABELS[diagramType]}
        </span>

        {onExport && (
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition-colors"
            title="Export Markdown Documentation"
            onClick={onExport}
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span>Export MD</span>
          </button>
        )}

        {onFullscreen && (
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
            title="Fullscreen Diagram"
            onClick={onFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}
