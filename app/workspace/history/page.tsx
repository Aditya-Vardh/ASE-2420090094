"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { History, Search, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { getHistory, setActiveProjectId } from "@/lib/storage/store";
import type { HistoryEntry } from "@/lib/storage/types";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

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
    return [...list].sort((a, b) =>
      sort === "newest"
        ? +new Date(b.createdAt) - +new Date(a.createdAt)
        : +new Date(a.createdAt) - +new Date(b.createdAt),
    );
  }, [history, query, filter, sort]);

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10 pt-8 sm:pt-12 pb-16 space-y-8">
      {/* Header */}
      <div className="border-b border-[#dddb9d]/15 pb-6">
        <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-3.5 py-1 backdrop-blur-md">
          <History className="h-3.5 w-3.5 text-[#7bc963]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#7bc963]">
            Generation Activity Timeline
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl">
          Generation History Log
        </h1>
        <p className="mt-2 text-base text-[#c8c69d] max-w-xl">
          Review previous AI synthesis requests, prompt iterations, and historical diagrams.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8c6c]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompt, project title, or diagram format…"
            className="w-full rounded-2xl border border-[#dddb9d]/20 bg-[#070804] px-4 py-3 pl-11 text-xs font-medium text-[#f2f1da] placeholder-[#8e8c6c] outline-none focus:border-[#7bc963]"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-2xl border border-[#dddb9d]/20 bg-[#070804] px-4 py-3 text-xs font-bold text-[#f2f1da] outline-none focus:border-[#7bc963]"
          >
            <option value="all" className="bg-[#12140a]">All Status</option>
            <option value="success" className="bg-[#12140a]">Success Only</option>
            <option value="error" className="bg-[#12140a]">Error Only</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-2xl border border-[#dddb9d]/20 bg-[#070804] px-4 py-3 text-xs font-bold text-[#f2f1da] outline-none focus:border-[#7bc963]"
          >
            <option value="newest" className="bg-[#12140a]">Newest First</option>
            <option value="oldest" className="bg-[#12140a]">Oldest First</option>
          </select>
        </div>
      </div>

      {/* List / Empty State */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#dddb9d]/20 bg-[#12140a]/60 p-10 text-center backdrop-blur-2xl">
          <History className="h-10 w-10 text-[#7bc963]/60 mb-3" />
          <h3 className="text-lg font-bold text-[#f2f1da]">No Matching History Entries</h3>
          <p className="mt-1 text-xs text-[#c8c69d]">Try clearing search filters or generate a new architecture.</p>
        </div>
      ) : (
        <div className="relative space-y-4">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="group relative overflow-hidden rounded-2xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-5 backdrop-blur-2xl transition-all hover:border-[#dddb9d]/35"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04]" />
              
              <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
                      {entry.projectTitle}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        entry.status === "success"
                          ? "bg-[#7bc963]/10 border border-[#7bc963]/30 text-[#7bc963]"
                          : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                      }`}
                    >
                      {entry.status === "success" ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {entry.status}
                    </span>
                    <span className="rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/10 px-2.5 py-0.5 font-mono text-[10px] text-[#dddb9d] uppercase font-bold">
                      {DIAGRAM_TYPE_LABELS[entry.diagramType]}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-[#c8c69d] line-clamp-2">
                    {entry.prompt}
                  </p>
                  <p className="mt-2 text-[10px] font-mono text-[#8e8c6c]">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>

                {entry.status === "success" && (
                  <Link
                    href={`/workspace/generate?project=${entry.projectId}`}
                    onClick={() => setActiveProjectId(entry.projectId)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#dddb9d]/20 bg-[#dddb9d]/10 px-4 py-2 text-xs font-bold text-[#7bc963] hover:bg-[#7bc963] hover:text-[#0a0b04] transition-all"
                  >
                    Open Canvas <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
