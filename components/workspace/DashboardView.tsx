"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Search, LayoutTemplate, FolderOpen, History, ArrowRight, Sparkles, Activity, GitBranch
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
    <div className="mx-auto max-w-6xl p-6 lg:p-10 pt-8 sm:pt-12 pb-16 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-gradient-to-b from-[#12140a]/95 via-[#0d0f06]/98 to-[#0a0b04] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(123,201,99,0.15)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7bc963]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#567f2b]/15 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-3.5 py-1 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#7bc963]" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#7bc963]">
                Architecture Workspace Active
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl">
              {getGreeting()}, Architect
            </h1>
            <p className="mt-2 text-base text-[#c8c69d] max-w-xl">
              Synthesize software diagrams, audit system resilience, and document cloud topologies with AI.
            </p>
          </div>

          <Link
            href="/workspace/generate?new=1"
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-6 py-4 text-sm font-bold text-[#0a0b04] shadow-[0_0_30px_rgba(123,201,99,0.3)] transition-all hover:scale-[1.03]"
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
          },
          {
            href: "/workspace/research",
            icon: Search,
            label: "AI Architecture Research",
            desc: "Compare system patterns, latencies, and scalability options",
          },
          {
            href: "/workspace/templates",
            icon: LayoutTemplate,
            label: "Template Gallery",
            desc: "Browse 12+ battle-tested starter system blueprints",
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#dddb9d]/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(123,201,99,0.15)] flex flex-col justify-between"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
              <div className="relative z-10">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dddb9d]/20 bg-[#dddb9d]/10 text-[#7bc963] shadow-inner group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
                  {action.label}
                </h3>
                <p className="mt-1.5 text-xs text-[#c8c69d] leading-relaxed">
                  {action.desc}
                </p>
              </div>
              <div className="relative z-10 mt-6 pt-3 flex items-center justify-between text-xs font-bold text-[#7bc963]">
                <span>Launch</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Health & AI Adaptive Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Architecture Score Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl border-l-4 border-l-[#7bc963]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#f2f1da] flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#7bc963]" /> System Health Score
            </h2>
            <span className="rounded-full bg-[#7bc963]/10 border border-[#7bc963]/30 px-2.5 py-0.5 font-mono text-[10px] text-[#7bc963] font-bold">
              Adaptive Audit
            </span>
          </div>

          {health ? (
            <div>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-[#f2f1da]">{health.health}</span>
                <span className="text-sm font-semibold text-[#c8c69d]">/ 100</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#070804] mb-4 border border-[#dddb9d]/10">
                <div
                  className="h-full bg-gradient-to-r from-[#dddb9d] to-[#7bc963] rounded-full transition-all duration-500"
                  style={{ width: `${health.health}%` }}
                />
              </div>
              <p className="text-xs font-bold text-[#7bc963] mb-1">{health.healthLabel}</p>
              <p className="text-xs text-[#c8c69d] truncate">From: {latestWithResult?.title}</p>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <span className="text-5xl font-extrabold text-[#8e8c6c]">--</span>
              </div>
              <p className="text-xs text-[#c8c69d] leading-relaxed">
                Generate an architecture in the canvas to run automated resilience and security audit scoring.
              </p>
            </div>
          )}
        </div>

        {/* AI Recommendations Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl border-l-4 border-l-[#dddb9d] flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#dddb9d]" />
              <h2 className="text-base font-bold text-[#f2f1da]">AI Adaptive Recommendations</h2>
            </div>
            <p className="text-sm leading-relaxed text-[#c8c69d]">
              {health?.suggestions[0]?.reason ?? "Use the 'Adaptive Insights' inspector panel after diagram synthesis to detect single points of failure, scaling bottlenecks, and caching enhancements."}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#dddb9d]/10 flex items-center justify-between">
            <span className="text-xs font-medium text-[#8e8c6c]">Instant AI Optimization</span>
            <Link
              href="/workspace/generate?new=1"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#7bc963] hover:text-[#91e577] transition-colors group"
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
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#f2f1da]">
              <FolderOpen className="h-5 w-5 text-[#7bc963]" /> Recent Projects
            </h2>
            <Link href="/workspace/projects" className="text-xs font-bold text-[#7bc963] hover:text-[#91e577] transition-colors">
              View All Projects →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#dddb9d]/20 bg-[#12140a]/50 p-10 text-center">
              <p className="text-sm text-[#c8c69d]">No saved projects yet. Create your first architecture in the studio.</p>
              <Link href="/workspace/generate?new=1" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#7bc963]">
                <Plus className="h-4 w-4" /> Start New Architecture
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/workspace/generate?project=${p.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 to-[#0a0b04] p-5 transition-all hover:border-[#dddb9d]/35 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-[#dddb9d]/10 border border-[#dddb9d]/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#dddb9d] uppercase">
                      {DIAGRAM_TYPE_LABELS[p.diagramType]}
                    </span>
                    <GitBranch className="h-4 w-4 text-[#8e8c6c] group-hover:text-[#7bc963] transition-colors" />
                  </div>
                  <h3 className="truncate text-sm font-bold text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-[#8e8c6c]">
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
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#f2f1da]">
              <History className="h-5 w-5 text-[#dddb9d]" /> Recent Generations
            </h2>
            <Link href="/workspace/history" className="text-xs font-bold text-[#7bc963] hover:text-[#91e577] transition-colors">
              View Log →
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#dddb9d]/20 bg-[#12140a]/50 p-10 text-center">
              <p className="text-sm text-[#c8c69d]">Your generated architecture history will log here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <Link
                  key={h.id}
                  href={`/workspace/generate?project=${h.projectId}`}
                  className="group flex items-center justify-between rounded-2xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 to-[#0a0b04] p-4 transition-all hover:border-[#dddb9d]/35"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
                      {h.projectTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8e8c6c]">
                      {new Date(h.createdAt).toLocaleDateString()} · {DIAGRAM_TYPE_LABELS[h.diagramType]}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#8e8c6c] group-hover:text-[#f2f1da] transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Starter Blueprints */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#f2f1da]">
            <LayoutTemplate className="h-5 w-5 text-[#7bc963]" /> Quick Architecture Starter Blueprints
          </h2>
          <Link href="/workspace/templates" className="text-xs font-bold text-[#7bc963] hover:text-[#91e577] transition-colors">
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
