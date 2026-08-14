"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { History, Search, ArrowRight, CheckCircle2, AlertCircle, GitCommit, Play, Sparkles } from "lucide-react";
import { getHistory, setActiveProjectId } from "@/lib/storage/store";
import type { HistoryEntry } from "@/lib/storage/types";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");

  useEffect(() => {
    const id = requestAnimationFrame(() => setHistory(getHistory()));
    return () => cancelAnimationFrame(id);
  }, []);

  const filtered = useMemo(() => {
    const list = history.filter((entry) => {
      if (filter !== "all" && entry.status !== filter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        entry.projectTitle.toLowerCase().includes(q) ||
        entry.prompt.toLowerCase().includes(q) ||
        DIAGRAM_TYPE_LABELS[entry.diagramType].toLowerCase().includes(q)
      );
    });
    return list;
  }, [history, query, filter]);

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10 pt-8 sm:pt-12 pb-16 space-y-8">
      {/* Header */}
      <div className="border-b border-[#dddb9d]/15 pb-6">
        <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-3.5 py-1 backdrop-blur-md">
          <History className="h-3.5 w-3.5 text-[#7bc963]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#7bc963]">
            Architecture Evolution &amp; Version System
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl">
          Architecture Evolution Timeline
        </h1>
        <p className="mt-2 text-base text-[#c8c69d] max-w-xl">
          Track architecture versions (v1 → v2 → v3), prompt refinements, health score gains, and system changes over time.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8c6c]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search architecture versions, prompts, or diagram types..."
          className="w-full rounded-2xl border border-[#dddb9d]/20 bg-[#12140a] pl-11 pr-4 py-3.5 text-xs text-[#f2f1da] placeholder-[#8e8c6c] outline-none focus:border-[#7bc963]"
        />
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-[#dddb9d]/15 bg-[#12140a] p-12 text-center text-xs text-[#c8c69d]">
            No architecture version history recorded yet. Create an architecture to populate version snapshots!
          </div>
        ) : (
          filtered.map((entry, idx) => {
            const versionTag = `v${filtered.length - idx}.0`;
            const isSuccess = entry.status === "success";

            return (
              <div
                key={entry.id}
                className="group relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-6 backdrop-blur-2xl transition-all hover:border-[#dddb9d]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#7bc963]/30 bg-[#7bc963]/10 text-[#7bc963] font-mono font-bold text-xs">
                    {versionTag}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#f2f1da]">{entry.projectTitle}</span>
                      <span className="rounded-full border border-[#dddb9d]/15 bg-[#070804] px-2.5 py-0.5 font-mono text-[10px] uppercase text-[#7bc963]">
                        {DIAGRAM_TYPE_LABELS[entry.diagramType]}
                      </span>
                    </div>
                    <p className="text-xs text-[#c8c69d] font-mono leading-relaxed max-w-xl">
                      "{entry.prompt}"
                    </p>
                    <p className="text-[10px] text-[#8e8c6c] pt-1">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isSuccess ? (
                    <Link
                      href={`/workspace/generate?project=${entry.projectId}`}
                      onClick={() => setActiveProjectId(entry.projectId)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#7bc963]/30 bg-[#7bc963]/10 px-4 py-2 text-xs font-bold text-[#7bc963] hover:bg-[#7bc963] hover:text-[#0a0b04] transition-all"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Open Version</span>
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 font-mono text-xs text-rose-400">
                      <AlertCircle className="h-4 w-4" /> Generation Error
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
