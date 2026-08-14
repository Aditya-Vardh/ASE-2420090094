"use client";

import { useState } from "react";
import { AlertCircle, Search, Loader2, BookOpen, Lightbulb, Sparkles, CheckCircle2 } from "lucide-react";
import type { ResearchResult } from "@/lib/storage/types";

const EXAMPLE_QUESTIONS = [
  { q: "What is the optimal architecture for a real-time chat application?", tag: "Realtime", tagColor: "bg-cyan-500/20 border-cyan-500/30 text-cyan-300" },
  { q: "Microservices vs modular monolith for an e-commerce startup?", tag: "Trade-off", tagColor: "bg-indigo-500/20 border-indigo-500/30 text-indigo-300" },
  { q: "Should I use PostgreSQL, MongoDB, or Redis for a social feed?", tag: "Database", tagColor: "bg-amber-500/20 border-amber-500/30 text-amber-300" },
  { q: "How do I design a high-throughput event-driven system with Kafka?", tag: "Scale", tagColor: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
];

export default function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);

  async function submit() {
    if (question.trim().length < 10 || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to complete research request right now.");
        return;
      }

      setResult(data as ResearchResult);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 backdrop-blur-md">
          <Search className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-300">
            Intelligence & Research Assistant
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          AI Architecture Research
        </h1>
        <p className="mt-2 text-base text-slate-300 max-w-2xl">
          Ask architectural questions and receive structured recommendations, latency trade-offs, and technology evaluations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        {/* Left Form & Suggestions */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 shadow-2xl backdrop-blur-2xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              <BookOpen className="h-4 w-4" /> Research Prompt
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={5}
              placeholder="Ask about microservice patterns, database selection, caching layers, serverless vs containers..."
              className="mb-5 w-full resize-none rounded-2xl border border-white/10 bg-[#07080F] p-4 text-sm leading-relaxed text-white placeholder-slate-400 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
            />

            <button
              type="button"
              onClick={submit}
              disabled={question.trim().length < 10 || loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 px-6 py-3.5 text-xs font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Synthesizing Architectural Analysis…</>
              ) : (
                <><Search className="h-4 w-4" /> Run Architecture Research</>
              )}
            </button>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Lightbulb className="h-4 w-4 text-amber-400" /> Suggested Architecture Questions
            </p>
            <div className="space-y-2">
              {EXAMPLE_QUESTIONS.map(({ q, tag, tagColor }) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuestion(q)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0A0C14]/80 p-4 text-left text-xs transition-all hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <span className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase ${tagColor}`}>
                    {tag}
                  </span>
                  <span className="text-slate-300 group-hover:text-white transition-colors line-clamp-1">{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div>
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-400 backdrop-blur-md">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          {!result && !loading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0A0C14]/60 p-10 text-center backdrop-blur-2xl">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Ask an Architecture Question</h3>
              <p className="mt-2 text-xs text-slate-400 max-w-sm leading-relaxed">
                Get evidence-backed trade-offs, technology choices, and structural recommendations.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#0A0C14]/90 p-10 text-center backdrop-blur-2xl shadow-2xl">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mb-4" />
              <p className="text-sm font-bold text-white">Analyzing Architecture Engineering Patterns…</p>
              <p className="mt-1 text-xs text-slate-400">Synthesizing trade-offs & technology suggestions</p>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              <ResultCard title="Executive Answer" color="cyan-400">
                {result.answer}
              </ResultCard>

              {result.recommendations.length > 0 && (
                <ResultCard title="Key Recommendations" color="indigo-400">
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </ResultCard>
              )}

              {result.alternatives.length > 0 && (
                <ResultCard title="Technology & Pattern Comparison" color="amber-400">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.alternatives.map((alt) => (
                      <div key={alt.name} className="rounded-2xl border border-white/10 bg-[#07080F] p-4">
                        <h4 className="font-bold text-white text-xs">{alt.name}</h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{alt.description}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              )}

              <ResultCard title="Trade-offs & Constraints" color="rose-400">
                {result.tradeoffs}
              </ResultCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-6 backdrop-blur-2xl">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className={`h-4 w-4 text-${color}`} />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="text-xs leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}
