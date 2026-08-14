"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Search, LayoutTemplate, FolderOpen, History, ArrowRight, Sparkles, Activity, ShieldCheck, Zap, GitBranch
} from "lucide-react";
import { getProjects, getHistory } from "@/lib/storage/store";
import type { Project, HistoryEntry } from "@/lib/storage/types";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";
import { TEMPLATES } from "@/lib/templates";
import { deriveAdaptiveInsights } from "@/lib/adaptive";
import MagicBento from "@/components/ui/MagicBento";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setProjects(getProjects().slice(0, 4));
      setHistory(getHistory().filter((h) => h.status === "success").slice(0, 4));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const latestWithResult = projects.find((p) => p.result);
  const health = latestWithResult?.result
    ? deriveAdaptiveInsights(latestWithResult.result)
    : null;

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-10 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0C0E1A] via-[#101326] to-[#16122B] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(99,102,241,0.15)]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-300">
                Architecture Workspace Active
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {getGreeting()}, Architect
            </h1>
            <p className="mt-2 text-base text-slate-300 max-w-xl">
              Synthesize software diagrams, audit system resilience, and document cloud topologies with AI.
            </p>
          </div>

          <Link
            href="/workspace/generate?new=1"
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 px-6 py-4 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition-all hover:scale-[1.03]"
          >
            <Sparkles className="h-4 w-4" />
            New Architecture
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          {
            href: "/workspace/generate?new=1",
            icon: Plus,
            label: "Create Architecture",
            desc: "Generate custom diagrams from natural language prompt",
            gradient: "from-cyan-500 to-blue-600",
            glow: "group-hover:border-cyan-400/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
            textTone: "text-cyan-400",
          },
          {
            href: "/workspace/research",
            icon: Search,
            label: "AI Architecture Research",
            desc: "Compare system patterns, latencies, and scalability options",
            gradient: "from-indigo-500 to-purple-600",
            glow: "group-hover:border-indigo-400/50 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]",
            textTone: "text-indigo-400",
          },
          {
            href: "/workspace/templates",
            icon: LayoutTemplate,
            label: "Template Gallery",
            desc: "Browse 12+ battle-tested starter system blueprints",
            gradient: "from-amber-500 to-orange-600",
            glow: "group-hover:border-amber-400/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
            textTone: "text-amber-400",
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 ${action.glow}`}
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-lg shadow-black/40 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {action.label}
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {action.desc}
              </p>
              <ArrowRight className={`absolute bottom-6 right-6 h-5 w-5 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${action.textTone}`} />
            </Link>
          );
        })}
      </div>

      {/* Health & AI Adaptive Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Architecture Score Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 backdrop-blur-2xl border-l-4 border-l-purple-500">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-400" /> System Health Score
            </h2>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 font-mono text-[10px] text-purple-300 font-semibold">
              Adaptive Audit
            </span>
          </div>

          {health ? (
            <div>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-white">{health.health}</span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 mb-4">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${health.health}%` }}
                />
              </div>
              <p className="text-xs font-bold text-purple-300 mb-1">{health.healthLabel}</p>
              <p className="text-xs text-slate-400 truncate">From: {latestWithResult?.title}</p>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <span className="text-5xl font-extrabold text-slate-600">--</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate an architecture in the canvas to run automated resilience and security audit scoring.
              </p>
            </div>
          )}
        </div>

        {/* AI Recommendations Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 backdrop-blur-2xl border-l-4 border-l-cyan-400 flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">AI Adaptive Recommendations</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {health?.suggestions[0]?.reason ?? "Use the 'Adaptive Insights' inspector panel after diagram synthesis to detect single points of failure, scaling bottlenecks, and caching enhancements."}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Instant AI Optimization</span>
            <Link
              href="/workspace/generate?new=1"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              Open Studio Canvas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Projects & History Split Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Projects */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
              <FolderOpen className="h-5 w-5 text-indigo-400" /> Recent Projects
            </h2>
            <Link href="/workspace/projects" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              View All Projects →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.01] p-10 text-center">
              <p className="text-sm text-slate-400">No saved projects yet. Create your first architecture in the studio.</p>
              <Link href="/workspace/generate?new=1" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Plus className="h-4 w-4" /> Start New Architecture
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/workspace/generate?project=${p.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0C14]/90 p-5 transition-all hover:border-white/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-300 uppercase">
                      {DIAGRAM_TYPE_LABELS[p.diagramType]}
                    </span>
                    <GitBranch className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="truncate text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Updated {new Date(p.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent History */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
              <History className="h-5 w-5 text-purple-400" /> Recent Generations
            </h2>
            <Link href="/workspace/history" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              View Log →
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.01] p-10 text-center">
              <p className="text-sm text-slate-400">Your generated architecture history will log here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <Link
                  key={h.id}
                  href={`/workspace/generate?project=${h.projectId}`}
                  className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0A0C14]/90 p-4 transition-all hover:border-white/20 hover:bg-white/[0.03]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {h.projectTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(h.createdAt).toLocaleDateString()} · {DIAGRAM_TYPE_LABELS[h.diagramType]}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Starter Blueprints */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
            <LayoutTemplate className="h-5 w-5 text-amber-400" /> Quick Architecture Starter Blueprints
          </h2>
          <Link href="/workspace/templates" className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
            Explore All Templates →
          </Link>
        </div>
        <MagicBento
          items={TEMPLATES.slice(0, 3).map((t, i) => ({
            title: t.name,
            description: t.description,
            href: `/workspace/generate?template=${t.id}`,
            accent: (["cyan", "violet", "amber"] as const)[i],
          }))}
        />
      </section>
    </div>
  );
}
