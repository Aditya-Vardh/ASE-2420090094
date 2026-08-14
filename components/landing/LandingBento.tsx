"use client";

import {
  Brain, GitBranch, Search, FileText, LayoutTemplate, Download
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
    title: "Natural Language Synthesis",
    desc: "Describe your system in plain English and ArchiGen synthesizes full system diagrams, microservices, and databases in seconds.",
    badge: "Synthesis Engine",
  },
  {
    num: "02",
    icon: GitBranch,
    iconClass: "text-[#dddb9d]",
    glowClass: "from-[#dddb9d]/20 to-[#c8c69d]/5",
    title: "Standardized UML & Flowcharts",
    desc: "Generate Class, Sequence, Component, ER, State, and Deployment diagrams with interactive node selection and editing.",
    badge: "8 UML Types",
  },
  {
    num: "03",
    icon: Search,
    iconClass: "text-[#7bc963]",
    glowClass: "from-[#7bc963]/15 to-[#567f2b]/5",
    title: "Architecture Research & Comparison",
    desc: "Compare system patterns, evaluate latency trade-offs, and ask deep architectural questions with contextual explanations.",
    badge: "Pattern Analysis",
  },
  {
    num: "04",
    icon: FileText,
    iconClass: "text-[#dddb9d]",
    glowClass: "from-[#dddb9d]/15 to-[#c8c69d]/5",
    title: "Structural Health & Audits",
    desc: "Automated analysis detects bottlenecks, security vulnerabilities, single points of failure, and scalability improvements.",
    badge: "Health Audit",
  },
  {
    num: "05",
    icon: LayoutTemplate,
    iconClass: "text-[#7bc963]",
    glowClass: "from-[#567f2b]/20 to-[#7bc963]/5",
    title: "Starter Architecture Blueprints",
    desc: "Launch instantly with pre-designed architecture blueprints for E-Commerce, Microservices, RAG Pipelines, and Streaming.",
    badge: "12+ Blueprints",
  },
  {
    num: "06",
    icon: Download,
    iconClass: "text-[#dddb9d]",
    glowClass: "from-[#dddb9d]/15 to-[#7bc963]/5",
    title: "Multi-Format Export",
    desc: "Export high-resolution PNG, vector SVG, raw Mermaid code, or complete Markdown system documentation with one click.",
    badge: "SVG / PNG / MD",
  },
];

export default function LandingBento() {
  return (
    <section id="features" className="relative border-t border-[#dddb9d]/10 px-4 py-28 sm:px-8 lg:py-36 bg-[#0a0b04]/90">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dddb9d]/30 bg-[#dddb9d]/10 px-4 py-1.5 backdrop-blur-md">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#dddb9d]">
              System Capabilities
            </span>
          </div>
          <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl">
            Everything You Need to Architect Software Systems
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#c8c69d]">
            A complete suite for synthesizing diagrams, auditing system health, and generating technical documentation.
          </p>
        </div>

        {/* Bento Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.num}
                className="group relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-8 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#dddb9d]/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(123,201,99,0.15)] flex flex-col justify-between"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/30 to-transparent" />
                <div className={`pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br ${f.glowClass} blur-2xl opacity-0 transition-opacity group-hover:opacity-100`} />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dddb9d]/15 bg-[#dddb9d]/08 ${f.iconClass} group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/08 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#c8c69d]">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold tracking-tight text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#c8c69d]">
                    {f.desc}
                  </p>
                </div>

                <div className="relative z-10 mt-8 font-mono text-xs font-bold text-[#8e8c6c]">
                  {f.num}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
