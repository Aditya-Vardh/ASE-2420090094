"use client";

import { useState } from "react";
import { X, CheckCircle2, ArrowRight, Sparkles, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import type { OptimizationResult } from "@/lib/graph/types";
import ArchitectureCanvas from "./ArchitectureCanvas";

type Props = {
  result: OptimizationResult;
  onClose: () => void;
  onApplyOptimized: () => void;
};

export default function ComparisonModal({ result, onClose, onApplyOptimized }: Props) {
  const [activeView, setActiveView] = useState<"side" | "original" | "optimized">("side");

  const origMermaid = result.originalGraph.nodes.map((n) => `    ${n.id}["${n.name}"]`).join("\n");
  const optMermaid = result.optimizedGraph.nodes.map((n) => `    ${n.id}["${n.name}"]`).join("\n");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-fade-in">
      <div className="flex h-[90vh] w-[95vw] max-w-7xl flex-col overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-[#0a0b04] text-[#f2f1da] shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#dddb9d]/15 bg-[#12140a] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#dddb9d] via-[#7bc963] to-[#567f2b] p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0a0b04]">
                <Sparkles className="h-5 w-5 text-[#7bc963]" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f2f1da]">Architecture Optimization Comparison</h2>
              <p className="text-xs text-[#c8c69d]">Side-by-side analysis of original vs optimized architecture graph.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Score Gain Badge */}
            <div className="flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-4 py-1.5">
              <span className="text-xs font-mono text-[#8e8c6c]">Health Score Gain:</span>
              <span className="font-mono text-sm font-bold text-[#c8c69d]">{result.originalHealth}</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#7bc963]" />
              <span className="font-mono text-base font-extrabold text-[#7bc963]">{result.optimizedHealth} / 100</span>
              <span className="rounded-md bg-[#7bc963] px-2 py-0.5 font-mono text-[11px] font-bold text-[#0a0b04]">
                +{result.optimizedHealth - result.originalHealth} pts
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#dddb9d]/15 bg-[#12140a] p-2 text-[#8e8c6c] hover:text-[#f2f1da] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center justify-between border-b border-[#dddb9d]/10 bg-[#070804] px-6 py-2.5">
          <div className="flex items-center gap-2 font-mono text-xs text-[#8e8c6c]">
            <span>Comparing:</span>
            <span className="font-bold text-[#f2f1da]">{result.originalGraph.title}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-[#dddb9d]/15 bg-[#12140a] p-1">
            {(["side", "original", "optimized"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setActiveView(v)}
                className={`rounded-lg px-3.5 py-1 text-xs font-bold capitalize transition-all ${
                  activeView === v
                    ? "bg-[#7bc963] text-[#0a0b04]"
                    : "text-[#c8c69d] hover:text-[#f2f1da]"
                }`}
              >
                {v === "side" ? "Split View" : v === "original" ? "Original (78)" : "Optimized (94)"}
              </button>
            ))}
          </div>
        </div>

        {/* Split View Workspace */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Modifications Explanation */}
          <div className="w-80 border-r border-[#dddb9d]/15 bg-[#0a0b04] p-5 overflow-y-auto shrink-0 space-y-4">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#7bc963]">Optimization Summary</p>
              <p className="mt-1 text-xs leading-relaxed text-[#c8c69d]">{result.explanation}</p>
            </div>

            <div className="space-y-3 pt-2">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8e8c6c]">Applied Structural Changes ({result.changes.length})</p>

              {result.changes.map((c) => (
                <div key={c.id} className="rounded-2xl border border-[#dddb9d]/15 bg-[#12140a] p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#f2f1da]">{c.title}</span>
                    <span className="rounded bg-[#7bc963]/20 px-2 py-0.5 font-mono text-[9px] font-bold text-[#7bc963]">
                      {c.type}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#c8c69d]">{c.description}</p>

                  <div className="border-t border-[#dddb9d]/10 pt-2 text-[10px] space-y-1">
                    <p className="text-[#7bc963] font-medium"><strong className="text-[#f2f1da]">Benefit:</strong> {c.expectedBenefit}</p>
                    <p className="text-[#8e8c6c]"><strong className="text-[#c8c69d]">Trade-off:</strong> {c.tradeoff}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Canvas Area */}
          <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden bg-[#070804]">
            {activeView === "side" ? (
              <div className="grid flex-1 grid-cols-2 divide-x divide-[#dddb9d]/15">
                <div className="flex flex-col min-h-0">
                  <div className="border-b border-[#dddb9d]/10 bg-[#12140a] px-4 py-2 text-xs font-bold text-[#c8c69d] flex items-center justify-between">
                    <span>Original Architecture</span>
                    <span className="font-mono text-[#8e8c6c]">Health: {result.originalHealth}/100</span>
                  </div>
                  <div className="flex-1 relative overflow-hidden">
                    <ArchitectureCanvas chart={`flowchart TB\n${origMermaid}`} />
                  </div>
                </div>

                <div className="flex flex-col min-h-0">
                  <div className="border-b border-[#dddb9d]/10 bg-[#12140a] px-4 py-2 text-xs font-bold text-[#7bc963] flex items-center justify-between">
                    <span>Optimized Architecture</span>
                    <span className="font-mono text-[#7bc963]">Health: {result.optimizedHealth}/100</span>
                  </div>
                  <div className="flex-1 relative overflow-hidden">
                    <ArchitectureCanvas chart={`flowchart TB\n${optMermaid}`} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 relative overflow-hidden">
                <ArchitectureCanvas
                  chart={`flowchart TB\n${activeView === "original" ? origMermaid : optMermaid}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#dddb9d]/15 bg-[#12140a] px-6 py-4">
          <p className="text-xs text-[#8e8c6c]">
            Applying optimizations updates the architecture project state and version graph.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#dddb9d]/20 bg-[#070804] px-5 py-2.5 text-xs font-bold text-[#c8c69d] hover:text-[#f2f1da] transition-colors"
            >
              Keep Original
            </button>

            <button
              type="button"
              onClick={() => {
                onApplyOptimized();
                onClose();
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-6 py-2.5 text-xs font-bold text-[#0a0b04] shadow-[0_0_25px_rgba(123,201,99,0.4)] hover:scale-[1.02] transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Apply Optimized Architecture ({result.optimizedHealth}/100)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
