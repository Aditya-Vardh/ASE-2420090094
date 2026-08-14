"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GitBranch, Sparkles, CheckCircle2, ArrowRight, Wand2, RefreshCw, AlertCircle, Layers } from "lucide-react";
import type { DiagramType, ArchitectureResult } from "@/lib/storage/types";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";
import ArchitectureCanvas from "@/components/workspace/ArchitectureCanvas";

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
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchitectureResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSynthesize() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: prompt || `Standard ${type} diagram specification`, diagramType: type }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "UML synthesis failed.");
        return;
      }

      setResult(data as ArchitectureResult);
    } catch {
      setError("Network error. Unable to synthesize UML.");
    } finally {
      setLoading(false);
    }
  }

  function openInStudio() {
    router.push(`/workspace/generate?new=1&type=${type}`);
  }

  const activeItem = UML_TYPES.find((t) => t.id === type) ?? UML_TYPES[0];

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-10 pt-8 sm:pt-12 pb-16 space-y-10">
      {/* Header */}
      <div className="border-b border-[#dddb9d]/15 pb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-3.5 py-1 backdrop-blur-md">
          <GitBranch className="h-3.5 w-3.5 text-[#7bc963]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#7bc963]">
            Standardized UML Synthesizer
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl leading-tight mb-2">
          UML Diagram Generator
        </h1>
        <p className="text-base text-[#c8c69d] max-w-2xl leading-relaxed">
          Select a standardized UML diagram specification, customize your design prompt, and generate clean, production-ready Mermaid diagrams.
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
              onClick={() => { setType(t.id); setResult(null); }}
              className={`group relative overflow-hidden flex flex-col justify-between rounded-3xl border p-6 text-left transition-all duration-300 ${
                active 
                  ? "bg-gradient-to-b from-[#12140a] to-[#0a0b04] border-[#7bc963] shadow-[0_0_35px_rgba(123,201,99,0.25)]" 
                  : "bg-gradient-to-b from-[#12140a]/90 to-[#0a0b04] border-[#dddb9d]/15 hover:border-[#dddb9d]/35 hover:-translate-y-1"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/30 to-transparent" />
              
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${active ? "border-[#7bc963] bg-[#7bc963]/20 text-[#7bc963]" : "border-[#dddb9d]/20 bg-[#dddb9d]/10 text-[#8e8c6c]"} group-hover:scale-110 transition-transform`}>
                    <GitBranch className="h-5 w-5" />
                  </div>
                  {active && (
                    <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#7bc963] uppercase bg-[#7bc963]/10 border border-[#7bc963]/30 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Selected
                    </span>
                  )}
                </div>

                <h3 className={`text-lg font-bold ${active ? "text-[#f2f1da]" : "text-[#c8c69d] group-hover:text-[#f2f1da]"}`}>
                  {t.label}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#c8c69d]">
                  {t.desc}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-3 border-t border-[#dddb9d]/10 flex items-center justify-between text-xs font-bold text-[#7bc963]">
                <span>Select Format</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Synthesis Control Box */}
      <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-gradient-to-b from-[#12140a] via-[#0d0f06] to-[#0a0b04] p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7bc963]/20 border border-[#7bc963]/30 text-[#7bc963] shadow-[0_0_20px_rgba(123,201,99,0.3)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#f2f1da]">{activeItem.label} Generator</p>
              <p className="mt-1 text-xs text-[#c8c69d]">
                Enter a system description below or click Synthesize to view standard {activeItem.label} specs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSynthesize}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-6 py-3.5 text-xs font-bold text-[#0a0b04] shadow-[0_0_30px_rgba(123,201,99,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              <span>Synthesize {activeItem.label}</span>
            </button>

            <button
              type="button"
              onClick={openInStudio}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#dddb9d]/20 bg-[#12140a] px-5 py-3.5 text-xs font-bold text-[#f2f1da] hover:border-[#dddb9d]/40 transition-colors"
            >
              <Layers className="h-4 w-4 text-[#7bc963]" />
              Open in Studio
            </button>
          </div>
        </div>

        {/* Input prompt */}
        <div className="relative z-10">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Customize prompt for ${activeItem.label} (e.g. User auth flow with JWT tokens, rate limiting and database lookup)...`}
            className="w-full rounded-2xl border border-[#dddb9d]/20 bg-[#070804] px-5 py-3.5 text-xs font-medium text-[#f2f1da] placeholder-[#8e8c6c] outline-none focus:border-[#7bc963]"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <p className="text-xs">{error}</p>
        </div>
      )}

      {/* Live Canvas View */}
      {result && (
        <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-[#0a0b04] h-[600px] shadow-2xl">
          <div className="flex items-center justify-between px-6 py-3 border-b border-[#dddb9d]/15 bg-[#12140a]">
            <span className="text-xs font-bold text-[#f2f1da] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#7bc963]" />
              {result.title} — {DIAGRAM_TYPE_LABELS[result.diagramType]} Live Preview
            </span>
            <span className="text-[10px] font-mono text-[#7bc963] uppercase">Mermaid Engine Ready</span>
          </div>

          <div className="relative h-[calc(100%-45px)] overflow-hidden">
            <ArchitectureCanvas
              chart={result.mermaidCode}
              result={result}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function UmlPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#c8c69d]">Loading UML engine…</div>}>
      <UmlContent />
    </Suspense>
  );
}
