"use client";

import {
  Brain, GitBranch, Search, FileText, LayoutTemplate, Download, ArrowUpRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  num: string;
  icon: LucideIcon;
  iconClass: string;
  glowClass: string;
  title: string;
  desc: string;
  badge: string;
};

const FEATURES: Feature[] = [
  {
    num: "01",
    icon: Brain,
    iconClass: "text-[#7bc963]",
    glowClass: "from-[#7bc963]/20 to-[#567f2b]/5",
    title: "Natural Language to Architecture",
    desc: "Describe your system in plain English and ArchiGen synthesizes full system diagrams, microservices, and databases in seconds.",
    badge: "Core AI Engine",
  },
  {
    num: "02",
    icon: GitBranch,
    iconClass: "text-[#dddb9d]",
    glowClass: "from-[#dddb9d]/20 to-[#c8c69d]/5",
    title: "Complete UML & Flowcharts",
    desc: "Generate Class, Sequence, Component, ER, State, and Deployment diagrams with interactive node selection and editing.",
    badge: "6+ UML Types",
  },
  {
    num: "03",
    icon: Search,
    iconClass: "text-[#7bc963]",
    glowClass: "from-[#7bc963]/15 to-[#567f2b]/5",
    title: "AI Architecture Research",
    desc: "Compare system patterns, evaluate latency trade-offs, and ask deep architectural questions with contextual AI explanations.",
    badge: "Research Assistant",
  },
  {
    num: "04",
    icon: FileText,
    iconClass: "text-[#dddb9d]",
    glowClass: "from-[#dddb9d]/15 to-[#c8c69d]/5",
    title: "Adaptive Scoring & Recommendations",
    desc: "Automated analysis detects bottlenecks, security vulnerabilities, single points of failure, and scalability improvements.",
    badge: "Adaptive Insights",
  },
  {
    num: "05",
    icon: LayoutTemplate,
    iconClass: "text-[#7bc963]",
    glowClass: "from-[#567f2b]/20 to-[#7bc963]/5",
    title: "Battle-Tested Templates",
    desc: "Jump-start projects with production-proven architecture blueprints — Microservices, Event-Driven, AI RAG, FinTech, and SaaS.",
    badge: "Starter Blueprint",
  },
  {
    num: "06",
    icon: Download,
    iconClass: "text-[#dddb9d]",
    glowClass: "from-[#dddb9d]/15 to-[#7bc963]/5",
    title: "Multi-Format Export",
    desc: "Export instantly as clean SVG, high-res PNG, Mermaid code, or comprehensive Markdown documentation.",
    badge: "Instant Export",
  },
];

export default function LandingBento() {
  return (
    <section id="features" className="relative px-4 py-28 sm:px-8 lg:py-36">
      {/* Background ambient */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-[#7bc963]/06 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-4 py-1.5 backdrop-blur-md">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7bc963]">
              Powerful Capabilities
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl lg:text-6xl">
            Everything You Need to <br />
            <span className="bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] bg-clip-text text-transparent">
              Architect Software Like a Pro
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[#c8c69d] sm:text-lg">
            From initial concept prompt to exportable Mermaid &amp; SVG diagrams,
            ArchiGen AI streamlines the full software design lifecycle.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.num}
              className="group relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-8 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#dddb9d]/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(123,201,99,0.15)]"
            >
              {/* Dot pattern */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
              {/* Top accent line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/30 to-transparent" />
              {/* Corner glow on hover */}
              <div className={`pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${f.glowClass} blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              <div className="relative z-10 mb-6 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dddb9d]/15 bg-[#dddb9d]/08 ${f.iconClass} group-hover:scale-110 transition-transform shadow-inner`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/08 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#c8c69d]">
                  {f.badge}
                </span>
              </div>

              <h3 className="relative z-10 mb-3 text-xl font-bold tracking-tight text-[#f2f1da] group-hover:text-[#7bc963] transition-colors flex items-center gap-1.5">
                {f.title}
                <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h3>

              <p className="relative z-10 text-sm leading-relaxed text-[#c8c69d]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
