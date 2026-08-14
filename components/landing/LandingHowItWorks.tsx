"use client";

import { FileText, Sparkles, Download, CheckCircle2 } from "lucide-react";
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
    <section id="how-it-works" className="relative border-t border-[#dddb9d]/10 px-4 py-28 sm:px-8 lg:py-36">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[600px] rounded-full bg-[#567f2b]/08 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-4 py-1.5 backdrop-blur-md">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7bc963]">
              Simple 3-Step Workflow
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl lg:text-6xl">
            From Plain Description to <br />
            <span className="bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] bg-clip-text text-transparent">
              Production Architecture in Seconds
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[#c8c69d] sm:text-lg">
            No complex manual drawing tools. No tedious shape dragging.
            Just describe your stack and let AI build the diagrams for you.
          </p>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left: Step Cards */}
          <div className="space-y-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group relative overflow-hidden flex gap-6 rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-xl transition-all duration-300 hover:border-[#dddb9d]/35 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04]" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/25 to-transparent" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#7bc963]/35 bg-gradient-to-br from-[#7bc963]/20 to-[#567f2b]/15 text-[#7bc963] shadow-[0_0_20px_rgba(123,201,99,0.2)] group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7" />
                    </div>
                    {!step.isLast && (
                      <div className="mt-4 h-full w-[2px] bg-gradient-to-b from-[#7bc963]/40 to-transparent" />
                    )}
                  </div>

                  <div className="relative z-10">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#7bc963]">
                        Step {step.num}
                      </span>
                      <span className="rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/08 px-3 py-0.5 text-[10px] font-medium text-[#c8c69d]">
                        {step.tag}
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold tracking-tight text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#c8c69d]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Code Window */}
          <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-[#080911] p-1 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(123,201,99,0.12)]">
            <div className="flex items-center justify-between border-b border-[#dddb9d]/10 bg-[#0E101A] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7bc963]/80" />
                </div>
                <span className="ml-2 font-mono text-[11px] font-medium text-[#8e8c6c]">
                  archigen_flow.py
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#7bc963] font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" /> Ready to Execute
              </div>
            </div>

            <div className="p-6 font-mono text-xs text-[#c8c69d] leading-relaxed overflow-x-auto">
              {MOCK_CODE.split("\n").map((line, i) => {
                const isComment = line.startsWith("#");
                const isOutput = line.startsWith("# ->");
                return (
                  <div key={i} className={
                    isOutput
                      ? "text-[#7bc963] font-semibold"
                      : isComment
                      ? "text-[#8e8c6c]"
                      : line.includes("prompt =") || line.includes("diagram =")
                      ? "text-[#dddb9d] font-medium"
                      : "text-[#c8c69d]"
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
