"use client";

import { MIN_CHARS } from "@/components/IdeaInput";
import {
  Loader2, Wand2, Command, Sparkles, ShoppingCart, MessageSquare,
  Hospital, Tv, Boxes, HeartPulse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DiagramType } from "@/lib/storage/types";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";

const EXAMPLES: { title: string; tags: string[]; prompt: string; icon: LucideIcon; tone: string; iconBg: string; textTone: string }[] = [
  {
    title: "E-Commerce",
    tags: ["React", "Redis"],
    prompt: "Build a scalable e-commerce platform with React frontend, Node.js API, PostgreSQL database, Redis caching, and Stripe payments.",
    icon: ShoppingCart,
    tone: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    iconBg: "bg-cyan-500/20",
    textTone: "text-cyan-400",
  },
  {
    title: "Real-Time Chat",
    tags: ["WebSocket"],
    prompt: "Design a real-time chat system with WebSocket connections, Redis pub/sub, user presence, and message persistence.",
    icon: MessageSquare,
    tone: "hover:border-violet-500/50 hover:shadow-violet-500/10",
    iconBg: "bg-violet-500/20",
    textTone: "text-violet-400",
  },
  {
    title: "Hospital",
    tags: ["Billing"],
    prompt: "Create a hospital management architecture with patient records, doctor scheduling, appointments, and billing systems.",
    icon: Hospital,
    tone: "hover:border-rose-500/50 hover:shadow-rose-500/10",
    iconBg: "bg-rose-500/20",
    textTone: "text-rose-400",
  },
  {
    title: "Streaming",
    tags: ["CDN"],
    prompt: "Design a Netflix-style streaming platform with video upload, transcoding, CDN delivery, and recommendation engine.",
    icon: Tv,
    tone: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    iconBg: "bg-amber-500/20",
    textTone: "text-amber-400",
  },
  {
    title: "SaaS",
    tags: ["Gateway"],
    prompt: "Design a multi-tenant SaaS with API gateway, auth service, billing service, and event-driven microservices.",
    icon: Boxes,
    tone: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    iconBg: "bg-blue-500/20",
    textTone: "text-blue-400",
  },
  {
    title: "AI Health",
    tags: ["LLM"],
    prompt: "Design an AI healthcare system with LLM inference, vector database, document ingestion, and secure patient data handling.",
    icon: HeartPulse,
    tone: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    iconBg: "bg-emerald-500/20",
    textTone: "text-emerald-400",
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
      <div className="rounded-xl border border-[var(--border-subtle)] bg-white/[0.03] p-2 backdrop-blur-md">
        <button type="button" onClick={onGenerate} disabled={!canGenerate || loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.08] disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          <span>Generate</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-[var(--border-subtle)] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--text-faint)]">AI Architecture Engine</p>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Describe your architecture</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)] max-w-xl">
            Tell ArchiGen what you&apos;re building — components, tech stack, and relationships. Be as detailed as you like.
          </p>
        </div>
        
        <div className="shrink-0">
          <select
            value={diagramType}
            onChange={(e) => onDiagramTypeChange(e.target.value as DiagramType)}
            className="w-full md:w-auto rounded-xl border border-[var(--border-subtle)] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            aria-label="Diagram type"
          >
            {Object.entries(DIAGRAM_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v} className="bg-[var(--bg-surface)]">{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.title}
            type="button"
            onClick={() => onPromptChange(ex.prompt)}
            className={`group relative overflow-hidden flex flex-col items-start gap-3 rounded-2xl border border-[var(--border-subtle)] bg-white/[0.02] p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-white/[0.04] ${ex.tone}`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${ex.iconBg}`}>
              <ex.icon className={`h-4 w-4 ${ex.textTone}`} />
            </div>
            <div className="min-w-0 w-full">
              <p className="truncate text-[14px] font-medium text-white">{ex.title}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ex.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)] group-hover:text-white transition-colors">{tag}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={5}
          placeholder="e.g. Build a scalable e-commerce platform with React frontend, Node.js API, PostgreSQL database, and Redis caching..."
          className="w-full resize-none rounded-2xl border border-[var(--border-subtle)] bg-black/20 p-5 text-[15px] leading-relaxed text-white placeholder-[var(--text-faint)] outline-none transition-all focus:border-indigo-500/50 focus:bg-black/30 focus:ring-2 focus:ring-indigo-500/20"
          aria-label="Architecture description"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <span className={`text-[12px] font-medium ${prompt.length > 0 && prompt.length < MIN_CHARS ? 'text-amber-400' : 'text-[var(--text-faint)]'}`}>
            {prompt.length} chars
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6">
        <p className="text-[13px] text-[var(--text-muted)]">
          {prompt.length > 0 && prompt.length < MIN_CHARS 
            ? <span className="text-amber-400">Add more detail for a richer architecture diagram.</span>
            : "Press Cmd+Enter to generate"}
        </p>
        
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className="btn-premium w-full sm:w-auto"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating architecture…</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" /> Generate Architecture</>
          )}
        </button>
      </div>
    </div>
  );
}
