"use client";

import { MIN_CHARS } from "@/components/IdeaInput";
import {
  Loader2, Wand2, Sparkles, ShoppingCart, MessageSquare,
  Hospital, Tv, Boxes, HeartPulse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DiagramType } from "@/lib/storage/types";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";

const EXAMPLES: { title: string; tags: string[]; prompt: string; icon: LucideIcon }[] = [
  {
    title: "E-Commerce",
    tags: ["React", "Redis"],
    prompt: "Build a scalable e-commerce platform with React frontend, Node.js API, PostgreSQL database, Redis caching, and Stripe payments.",
    icon: ShoppingCart,
  },
  {
    title: "Real-Time Chat",
    tags: ["WebSocket"],
    prompt: "Design a real-time chat system with WebSocket connections, Redis pub/sub, user presence, and message persistence.",
    icon: MessageSquare,
  },
  {
    title: "Hospital",
    tags: ["Billing"],
    prompt: "Create a hospital management architecture with patient records, doctor scheduling, appointments, and billing systems.",
    icon: Hospital,
  },
  {
    title: "Streaming",
    tags: ["CDN"],
    prompt: "Design a Netflix-style streaming platform with video upload, transcoding, CDN delivery, and recommendation engine.",
    icon: Tv,
  },
  {
    title: "SaaS",
    tags: ["Gateway"],
    prompt: "Design a multi-tenant SaaS with API gateway, auth service, billing service, and event-driven microservices.",
    icon: Boxes,
  },
  {
    title: "AI Health",
    tags: ["LLM"],
    prompt: "Design an AI healthcare system with LLM inference, vector database, document ingestion, and secure patient data handling.",
    icon: HeartPulse,
  },
];

type Props = {
  prompt: string;
  onPromptChange: (v: string) => void;
  diagramType: DiagramType;
  onDiagramTypeChange: (v: DiagramType) => void;
  loading: boolean;
  onGenerate: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export default function AIGenerationPanel({
  prompt, onPromptChange, diagramType, onDiagramTypeChange, loading, onGenerate,
  collapsed = false,
}: Props) {
  const canGenerate = prompt.trim().length >= MIN_CHARS;

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canGenerate && !loading) {
      e.preventDefault();
      onGenerate();
    }
  }

  if (collapsed) {
    return (
      <div className="rounded-2xl border border-[#dddb9d]/20 bg-[#12140a]/90 p-3 backdrop-blur-xl flex items-center justify-between">
        <span className="text-xs font-bold text-[#f2f1da]">Architecture Prompt Panel</span>
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7bc963] px-4 py-2 text-xs font-bold text-[#0a0b04] hover:bg-[#91e577] transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          <span>Generate</span>
        </button>
      </div>
    );
  }

  return (
    <div className="group relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-gradient-to-b from-[#12140a]/95 via-[#0d0f06]/98 to-[#0a0b04] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(123,201,99,0.15)] backdrop-blur-2xl">
      {/* Subtle Dot Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7bc963]/15 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-[#7bc963] animate-pulse" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#7bc963]">
                AI Architecture Synthesizer
              </p>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#f2f1da]">
              Describe Your Architecture
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#c8c69d] max-w-xl">
              Tell ArchiGen what you&apos;re building — components, tech stack, and relationships.
            </p>
          </div>
          
          <div className="shrink-0">
            <label className="block mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#8e8c6c]">
              Diagram Spec
            </label>
            <select
              value={diagramType}
              onChange={(e) => onDiagramTypeChange(e.target.value as DiagramType)}
              className="w-full md:w-auto rounded-2xl border border-[#dddb9d]/20 bg-[#070804] px-4 py-2.5 text-xs font-bold text-[#f2f1da] outline-none transition-colors hover:border-[#dddb9d]/40 focus:border-[#7bc963]"
              aria-label="Diagram type"
            >
              {Object.entries(DIAGRAM_TYPE_LABELS).map(([v, l]) => (
                <option key={v} value={v} className="bg-[#12140a]">{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Starter Chips */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EXAMPLES.map((ex) => {
            const Icon = ex.icon;
            return (
              <button
                key={ex.title}
                type="button"
                onClick={() => onPromptChange(ex.prompt)}
                className="group/chip relative overflow-hidden flex flex-col items-start gap-2.5 rounded-2xl border border-[#dddb9d]/15 bg-[#12140a]/80 p-4 text-left transition-all hover:border-[#dddb9d]/35 hover:bg-[#1a1d0e] hover:-translate-y-0.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#dddb9d]/20 bg-[#dddb9d]/10 text-[#7bc963] group-hover/chip:scale-110 transition-transform">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 w-full">
                  <p className="truncate text-xs font-bold text-[#f2f1da] group-hover/chip:text-[#7bc963] transition-colors">
                    {ex.title}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {ex.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#dddb9d]/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#c8c69d]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Textarea Input */}
        <div className="relative mb-6">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
            placeholder="e.g. Build a scalable e-commerce platform with React frontend, Node.js API gateway, PostgreSQL database, and Redis caching..."
            className="w-full resize-none rounded-2xl border border-[#dddb9d]/20 bg-[#070804] p-5 text-sm leading-relaxed text-[#f2f1da] placeholder-[#8e8c6c] outline-none transition-all focus:border-[#7bc963] focus:ring-1 focus:ring-[#7bc963]/30"
            aria-label="Architecture description"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <span className={`font-mono text-xs ${prompt.length > 0 && prompt.length < MIN_CHARS ? 'text-amber-400 font-bold' : 'text-[#8e8c6c]'}`}>
              {prompt.length} chars
            </span>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#dddb9d]/15 pt-6">
          <p className="text-xs text-[#c8c69d]">
            {prompt.length > 0 && prompt.length < MIN_CHARS 
              ? <span className="text-amber-400 font-bold">Minimum 15 characters required for AI synthesis.</span>
              : "Press Cmd+Enter or Ctrl+Enter to generate"}
          </p>
          
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate || loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-8 py-4 text-xs font-bold text-[#0a0b04] shadow-[0_0_30px_rgba(123,201,99,0.3)] transition-all hover:scale-[1.02] disabled:opacity-40 cursor-pointer"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Synthesizing Architecture…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate Architecture Canvas</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
