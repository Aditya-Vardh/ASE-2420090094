"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GitBranch, Sparkles, Layers, CheckCircle2, ArrowRight } from "lucide-react";
import type { DiagramType } from "@/lib/storage/types";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";

const UML_TYPES: { id: DiagramType; label: string; desc: string }[] = [
  { id: "class", label: "Class Diagram", desc: "Object-oriented structure, attributes, methods, & relationships" },
  { id: "sequence", label: "Sequence Diagram", desc: "Time-ordered interaction flow between components & objects" },
  { id: "component", label: "Component Diagram", desc: "High-level physical modules, libraries, & API interfaces" },
  { id: "deployment", label: "Deployment Diagram", desc: "Hardware nodes, servers, container clusters, & networks" },
  { id: "er", label: "Entity-Relationship (ER)", desc: "Database tables, primary keys, foreign keys, & cardinalities" },
  { id: "state", label: "State Machine", desc: "State transitions, triggers, conditions, & lifecycle flow" },
];

function UmlContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("type") as DiagramType | null;
  const [type, setType] = useState<DiagramType>(
    initial && UML_TYPES.some((t) => t.id === initial) ? initial : "class",
  );

  function openWorkspace() {
    router.push(`/workspace/generate?new=1&type=${type}`);
  }

  const activeItem = UML_TYPES.find((t) => t.id === type) ?? UML_TYPES[0];

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3.5 py-1 backdrop-blur-md">
          <GitBranch className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-300">
            Design Tool & Synthesizer
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          UML Diagram Generator
        </h1>
        <p className="mt-2 text-base text-slate-300 max-w-2xl leading-relaxed">
          Select a standardized UML diagram specification, then describe your software logic in natural language.
        </p>
      </div>

      {/* UML Grid Selection */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {UML_TYPES.map((t) => {
          const active = type === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={`group relative flex flex-col justify-between rounded-3xl border p-6 text-left transition-all duration-300 ${
                active 
                  ? "bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/10 border-indigo-400/60 shadow-[0_0_35px_rgba(99,102,241,0.3)]" 
                  : "bg-[#0A0C14]/90 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]"
              }`}
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${active ? "border-indigo-400/50 bg-indigo-500/20 text-white" : "border-white/10 bg-white/[0.04] text-slate-400"} group-hover:scale-110 transition-transform`}>
                    <GitBranch className="h-5 w-5" />
                  </div>
                  {active && (
                    <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-cyan-300 uppercase bg-cyan-400/10 border border-cyan-400/30 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Selected
                    </span>
                  )}
                </div>

                <h3 className={`text-lg font-bold ${active ? "text-white" : "text-slate-200 group-hover:text-white"}`}>
                  {t.label}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {t.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-indigo-400">
                <span>Select Format</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Action Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0C0E1A] to-[#141026] p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <Sparkles className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">{activeItem.label}</p>
              <p className="mt-1 text-xs text-slate-300">
                Generate in the Studio Canvas with live Mermaid preview, property inspector, and export tools.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openWorkspace}
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-[1.03] shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            Generate {activeItem.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UmlPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-400">Loading UML engine…</div>}>
      <UmlContent />
    </Suspense>
  );
}
