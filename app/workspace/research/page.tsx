"use client";

import { useState } from "react";
import { AlertCircle, Search, Loader2, BookOpen, Lightbulb, Sparkles, CheckCircle2 } from "lucide-react";
import type { ResearchResult } from "@/lib/storage/types";

const EXAMPLE_QUESTIONS = [
  { q: "What is the optimal architecture for a real-time chat application?", tag: "Realtime" },
  { q: "Microservices vs modular monolith for an e-commerce startup?", tag: "Trade-off" },
  { q: "Should I use PostgreSQL, MongoDB, or Redis for a social feed?", tag: "Database" },
  { q: "How do I design a high-throughput event-driven system with Kafka?", tag: "Scale" },
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
    <div className="mx-auto max-w-6xl p-6 lg:p-10 pt-8 sm:pt-12 pb-16 space-y-10">
      {/* Header */}
      <div className="border-b border-[#dddb9d]/15 pb-6">
        <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-3.5 py-1 backdrop-blur-md">
          <Search className="h-3.5 w-3.5 text-[#7bc963]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#7bc963]">
            Intelligence & Research Assistant
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl">
          AI Architecture Research
        </h1>
        <p className="mt-2 text-base text-[#c8c69d] max-w-2xl">
          Ask architectural questions and receive structured recommendations, latency trade-offs, and technology evaluations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        {/* Left Form & Suggestions */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-gradient-to-b from-[#12140a]/95 via-[#0d0f06]/98 to-[#0a0b04] p-7 shadow-2xl backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
            
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#7bc963]">
                <BookOpen className="h-4 w-4" /> Research Prompt
              </div>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={5}
                placeholder="Ask about microservice patterns, database selection, caching layers, serverless vs containers..."
                className="mb-5 w-full resize-none rounded-2xl border border-[#dddb9d]/20 bg-[#070804] p-4 text-sm leading-relaxed text-[#f2f1da] placeholder-[#8e8c6c] outline-none focus:border-[#7bc963]"
              />

              <button
                type="button"
                onClick={submit}
                disabled={question.trim().length < 10 || loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-6 py-3.5 text-xs font-bold text-[#0a0b04] shadow-[0_0_25px_rgba(123,201,99,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Synthesizing Architectural Analysis…</>
                ) : (
                  <><Search className="h-4 w-4" /> Run Architecture Research</>
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#8e8c6c]">
              <Lightbulb className="h-4 w-4 text-[#dddb9d]" /> Suggested Architecture Questions
            </p>
            <div className="space-y-2">
              {EXAMPLE_QUESTIONS.map(({ q, tag }) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuestion(q)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-[#dddb9d]/15 bg-[#12140a]/80 p-4 text-left text-xs transition-all hover:border-[#dddb9d]/35 hover:bg-[#1a1d0e]"
                >
                  <span className="shrink-0 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase text-[#7bc963]">
                    {tag}
                  </span>
                  <span className="text-[#c8c69d] group-hover:text-[#f2f1da] transition-colors line-clamp-1">{q}</span>
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
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#dddb9d]/20 bg-[#12140a]/60 p-10 text-center backdrop-blur-2xl">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dddb9d]/10 border border-[#dddb9d]/30 text-[#7bc963] shadow-[0_0_30px_rgba(123,201,99,0.2)]">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[#f2f1da]">Ask an Architecture Question</h3>
              <p className="mt-2 text-xs text-[#c8c69d] max-w-sm leading-relaxed">
                Get evidence-backed trade-offs, technology choices, and structural recommendations.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-[#dddb9d]/20 bg-[#12140a]/90 p-10 text-center backdrop-blur-2xl shadow-2xl">
              <Loader2 className="h-10 w-10 animate-spin text-[#7bc963] mb-4" />
              <p className="text-sm font-bold text-[#f2f1da]">Analyzing Architecture Engineering Patterns…</p>
              <p className="mt-1 text-xs text-[#c8c69d]">Synthesizing trade-offs & technology suggestions</p>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              <ResultCard title="Executive Answer">
                {result.answer}
              </ResultCard>

              {result.recommendations.length > 0 && (
                <ResultCard title="Key Recommendations">
                  <ul className="space-y-2 text-xs text-[#c8c69d]">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#7bc963] mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </ResultCard>
              )}

              {result.alternatives.length > 0 && (
                <ResultCard title="Technology & Pattern Comparison">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.alternatives.map((alt) => (
                      <div key={alt.name} className="rounded-2xl border border-[#dddb9d]/15 bg-[#070804] p-4">
                        <h4 className="font-bold text-[#f2f1da] text-xs">{alt.name}</h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#c8c69d]">{alt.description}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              )}

              <ResultCard title="Trade-offs & Constraints">
                {result.tradeoffs}
              </ResultCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-6 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04]" />
      
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#7bc963]" />
          <h3 className="text-sm font-bold text-[#f2f1da]">{title}</h3>
        </div>
        <div className="text-xs leading-relaxed text-[#c8c69d]">{children}</div>
      </div>
    </div>
  );
}
