"use client";

import {
  Brain, GitBranch, Search, FileText, LayoutTemplate, Download, ArrowUpRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  num: string;
  icon: LucideIcon;
  iconColor: string;
  glowColor: string;
  title: string;
  desc: string;
  badge: string;
};

const FEATURES: Feature[] = [
  {
    num: "01",
    icon: Brain,
    iconColor: "text-indigo-400",
    glowColor: "from-indigo-500/20 to-violet-500/5",
    title: "Natural Language to Architecture",
    desc: "Describe your system in plain English and ArchiGen synthesizes full system diagrams, microservices, and databases in seconds.",
    badge: "Core AI Engine",
  },
  {
    num: "02",
    icon: GitBranch,
    iconColor: "text-cyan-400",
    glowColor: "from-cyan-500/20 to-blue-500/5",
    title: "Complete UML & Flowcharts",
    desc: "Generate Class, Sequence, Component, ER, State, and Deployment diagrams with interactive node selection and editing.",
    badge: "6+ UML Types",
  },
  {
    num: "03",
    icon: Search,
    iconColor: "text-amber-400",
    glowColor: "from-amber-500/20 to-orange-500/5",
    title: "AI Architecture Research",
    desc: "Compare system patterns, evaluate latency trade-offs, and ask deep architectural questions with contextual AI explanations.",
    badge: "Research Assistant",
  },
  {
    num: "04",
    icon: FileText,
    iconColor: "text-emerald-400",
    glowColor: "from-emerald-500/20 to-teal-500/5",
    title: "Adaptive Scoring & Recommendations",
    desc: "Automated analysis detects bottlenecks, security vulnerabilities, single points of failure, and scalability improvements.",
    badge: "Adaptive Insights",
  },
  {
    num: "05",
    icon: LayoutTemplate,
    iconColor: "text-rose-400",
    glowColor: "from-rose-500/20 to-purple-500/5",
    title: "Battle-Tested Templates",
    desc: "Jump-start projects with production-proven architecture blueprints — Microservices, Event-Driven, AI RAG, FinTech, and SaaS.",
    badge: "Starter Blueprint",
  },
  {
    num: "06",
    icon: Download,
    iconColor: "text-purple-400",
    glowColor: "from-purple-500/20 to-pink-500/5",
    title: "Multi-Format Export",
    desc: "Export instantly as clean SVG, high-res PNG, Mermaid code, or comprehensive Markdown documentation.",
    badge: "Instant Export",
  },
];

export default function LandingBento() {
  return (
    <section id="features" className="relative px-4 py-28 sm:px-8 lg:py-36">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-1.5 backdrop-blur-md">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
              Powerful Capabilities
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Everything You Need to <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Architect Software Like a Pro
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg">
            From initial concept prompt to exportable Mermaid & SVG diagrams, 
            ArchiGen AI streamlines the full software design lifecycle.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.num}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0C14]/80 p-8 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(99,102,241,0.15)]"
            >
              {/* Corner Glow Overlay */}
              <div className={`pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${f.glowColor} blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              <div className="mb-6 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] ${f.iconColor} group-hover:scale-110 transition-transform shadow-inner`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {f.badge}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                {f.title}
                <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h3>

              <p className="text-sm leading-relaxed text-slate-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
