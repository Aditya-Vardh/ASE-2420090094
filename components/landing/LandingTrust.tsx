"use client";

import { useEffect, useRef, useState } from "react";
import { Cpu, Zap, Shield, GitBranch, ChevronLeft, ChevronRight, Layers, Activity } from "lucide-react";

const STATS = [
  {
    number: "25,000+",
    label: "Architectures Generated",
    desc: "Production microservices, cloud topologies, and UML diagrams synthesized for dev teams worldwide.",
    icon: Zap,
    tag: "AI Synthesis",
  },
  {
    number: "8+ Formats",
    label: "UML & Cloud Schemas",
    desc: "Supports Class, Sequence, ER, Component, State, Flowchart, and Kubernetes Deployment diagrams.",
    icon: GitBranch,
    tag: "Standardized UML",
  },
  {
    number: "< 2.5s",
    label: "Avg Synthesis Speed",
    desc: "Sub-second natural language parsing to valid Mermaid.js code & high-res SVG canvas rendering.",
    icon: Cpu,
    tag: "High Speed Engine",
  },
  {
    number: "100% Privacy",
    label: "Local Storage & Privacy",
    desc: "All project files, prompts, and history logs stay encrypted inside browser local storage.",
    icon: Shield,
    tag: "Client-Side Privacy",
  },
  {
    number: "Instant Export",
    label: "Multi-Format Exports",
    desc: "Download high-res PNG, vector SVG, raw Mermaid code, or Markdown documentation with 1 click.",
    icon: Layers,
    tag: "Production Delivery",
  },
  {
    number: "Adaptive AI",
    label: "Architecture Audit & Health",
    desc: "Automated analysis scores resilience, security, and scalability with single-point-of-failure detection.",
    icon: Activity,
    tag: "Adaptive Insights",
  },
];

export default function LandingTrust() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Automatic right-to-left continuous sliding loop at a snappy speed
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 15) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 1800); // Snappy 1.8s interval speed

    return () => clearInterval(interval);
  }, [isHovered]);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative border-y border-[#dddb9d]/15 bg-[#0a0b04]/80 py-12 backdrop-blur-2xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7bc963] animate-pulse" />
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#7bc963]">
              Platform Metrics &amp; Auto-Scrolling Capabilities
            </p>
            <span className="rounded-full bg-[#7bc963]/10 border border-[#7bc963]/30 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#7bc963] uppercase">
              Right-to-Left Auto-Scroll Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#dddb9d]/20 bg-[#12140a] text-[#8e8c6c] hover:bg-[#dddb9d]/10 hover:text-[#f2f1da] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#dddb9d]/20 bg-[#12140a] text-[#8e8c6c] hover:bg-[#dddb9d]/10 hover:text-[#f2f1da] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Automatic Sidewise Scrolling Track */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-stretch gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group relative min-w-[280px] sm:min-w-[310px] flex-1 snap-start overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/95 via-[#0d0f06]/98 to-[#0a0b04] p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#dddb9d]/35 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(123,201,99,0.15)] flex flex-col justify-between"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:18px_18px] opacity-[0.04]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/30 to-transparent" />

                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#dddb9d]/20 bg-[#dddb9d]/10 text-[#7bc963] group-hover:scale-110 transition-transform shadow-inner">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/08 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#dddb9d] uppercase">
                      {stat.tag}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-[#dddb9d] via-[#f2f1da] to-[#7bc963] bg-clip-text text-3xl font-extrabold text-transparent tracking-tight">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-xs font-bold text-[#f2f1da]">
                    {stat.label}
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#c8c69d]">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
