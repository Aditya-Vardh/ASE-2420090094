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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#dddb9d]/15 bg-[#0a0b04]/90 px-4 sm:px-6 backdrop-blur-2xl z-20">
      {/* Left Title Input */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#dddb9d]/10 border border-[#dddb9d]/30 text-[#7bc963]">
          <Layers className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="rounded-xl border border-transparent bg-transparent px-2.5 py-1 text-sm font-bold text-[#f2f1da] transition-colors hover:border-[#dddb9d]/20 focus:border-[#7bc963] focus:bg-[#12140a] outline-none"
          aria-label="Project name"
        />
        {saved && (
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-[#7bc963] bg-[#7bc963]/10 border border-[#7bc963]/30 px-2.5 py-0.5 rounded-full">
            <Check className="h-3 w-3" /> Auto-Saved
          </span>
        )}
      </div>

      {/* Center Studio Pill */}
      <div className="hidden md:flex items-center gap-2 rounded-full border border-[#dddb9d]/15 bg-[#12140a] px-3.5 py-1 text-xs text-[#c8c69d]">
        <Sparkles className="h-3.5 w-3.5 text-[#7bc963]" />
        <span>Arqen AI Studio Canvas</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <span className="rounded-full border border-[#dddb9d]/30 bg-[#dddb9d]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-[#dddb9d]">
          {DIAGRAM_TYPE_LABELS[diagramType]}
        </span>

        {onExport && (
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-xl border border-[#dddb9d]/20 bg-[#12140a] px-3 text-xs font-bold text-[#f2f1da] hover:bg-[#dddb9d]/10 hover:text-white transition-colors"
            title="Export Markdown Documentation"
            onClick={onExport}
          >
            <Download className="h-3.5 w-3.5 text-[#7bc963]" />
            <span>Export MD</span>
          </button>
        )}

        {onFullscreen && (
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#dddb9d]/20 bg-[#12140a] text-[#c8c69d] hover:bg-[#dddb9d]/10 hover:text-[#f2f1da] transition-colors"
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
