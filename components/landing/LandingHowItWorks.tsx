"use client";

import { FileText, Sparkles, Download, ArrowRight, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Step = {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
  isLast?: boolean;
};

const STEPS: Step[] = [
  {
    num: "01",
    icon: FileText,
    title: "1. Prompt Your Architecture",
    desc: "Enter your system prompt in plain English — specify frontend frameworks, backend microservices, databases, authentication, and cloud infrastructure requirements.",
    tag: "Input Stage",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "2. AI Synthesizes Diagrams",
    desc: "ArchiGen AI parses your natural language input, constructs relationships, calculates optimization heuristics, and generates precise Mermaid UML specs instantly.",
    tag: "AI Processing",
  },
  {
    num: "03",
    icon: Download,
    title: "3. Inspect & Export",
    desc: "Interact with live nodes on the canvas, view adaptive health metrics, refine via AI assistant prompt, and export to SVG, PNG, or Markdown.",
    tag: "Production Delivery",
    isLast: true,
  },
];

const MOCK_CODE = `# 1. Enter System Prompt
prompt = """
E-Commerce Platform Architecture:
- Next.js Web App + React Native Mobile
- Node.js API Gateway with Auth JWT
- PostgreSQL DB + Redis Caching Layer
- Stripe Payments + Kafka Event Bus
"""

# 2. AI Synthesis Engine
diagram = archigen.synthesize(prompt, type="architecture")

# 3. Generated Mermaid.js Diagram
# -> graph TD
#      App[Next.js App] --> Gateway[API Gateway]
#      Gateway --> DB[(PostgreSQL)]
#      Gateway --> Cache[(Redis)]`;

export default function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-white/[0.08] px-4 py-28 sm:px-8 lg:py-36">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[600px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 backdrop-blur-md">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Simple 3-Step Workflow
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            From Plain Description to <br />
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Production Architecture in Seconds
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg">
            No complex manual drawing tools. No tedious shape dragging. 
            Just describe your stack and let AI build the diagrams for you.
          </p>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left: Step Cards */}
          <div className="space-y-8">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group relative flex gap-6 rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03] hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7" />
                    </div>
                    {!step.isLast && (
                      <div className="mt-4 h-full w-[2px] bg-gradient-to-b from-cyan-400/40 to-transparent" />
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400">
                        Step {step.num}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-[10px] font-medium text-slate-300">
                        {step.tag}
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Interactive Code Window */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080911] p-1 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.15)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0E101A] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-2 font-mono text-[11px] font-medium text-slate-400">
                  archigen_flow.py
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" /> Ready to Execute
              </div>
            </div>

            <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              {MOCK_CODE.split("\n").map((line, i) => {
                const isComment = line.startsWith("#");
                const isOutput = line.startsWith("# ->");
                return (
                  <div key={i} className={
                    isOutput
                      ? "text-cyan-300 font-semibold"
                      : isComment
                      ? "text-slate-500"
                      : line.includes("prompt =") || line.includes("diagram =")
                      ? "text-indigo-400 font-medium"
                      : "text-slate-300"
                  }>
                    {line || "\u00A0"}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
