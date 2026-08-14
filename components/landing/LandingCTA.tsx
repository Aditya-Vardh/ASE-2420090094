"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function LandingCTA() {
  return (
    <section className="relative px-4 py-28 sm:px-8 lg:py-36 overflow-hidden">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B0D18] via-[#0E1020] to-[#120D24] p-8 sm:p-14 lg:p-20 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(99,102,241,0.2)]">
        {/* Glow backdrop inside container */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Free & Open Workspace · No Login Required
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready to Architect Your Next System?
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-base text-slate-300 sm:text-lg">
            Turn system descriptions into exportable UML diagrams, component graphs, 
            and adaptive architectural insights in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/workspace/generate?new=1"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 px-9 py-4 text-sm font-bold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]"
            >
              <Sparkles className="h-4 w-4" />
              Launch Architecture Studio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/workspace/templates"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-slate-200 backdrop-blur-xl transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              Explore Templates
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Local privacy guaranteed · Export to SVG, PNG, Markdown</span>
          </div>
        </div>
      </div>
    </section>
  );
}
