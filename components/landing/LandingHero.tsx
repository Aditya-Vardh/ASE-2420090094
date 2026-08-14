"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Play, ShieldCheck, Zap, Layers } from "lucide-react";
import ArchitectureDemo from "./ArchitectureDemo";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:pb-36 lg:pt-32">
      {/* Background Grid Pattern */}
      <div className="arch-grid-bg pointer-events-none absolute inset-0 opacity-[0.14]" />

      {/* Atmospheric Ambient Glow Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/20 to-purple-600/20 blur-[140px]" />
        <div className="absolute right-[-10%] top-1/4 h-[450px] w-[550px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[350px] w-[450px] rounded-full bg-cyan-500/15 blur-[100px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Left Column: Headlines & CTAs */}
        <div className="animate-fade-in-up">
          {/* Eyebrow Pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Next-Gen AI Architecture Engine
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5rem]">
            Describe it. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(99,102,241,0.3)]">
              Architect it.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Turn system descriptions into production-ready software architecture diagrams, 
            microservice maps, and UML specifications in seconds with AI.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/workspace/generate?new=1"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]"
            >
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              Generate Architecture Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/workspace/templates"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-slate-200 backdrop-blur-xl transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <Layers className="h-4 w-4 text-slate-400" />
              Explore Templates
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Production Ready</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Instant Mermaid Export</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span>Adaptive AI Insights</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Demo */}
        <div className="animate-fade-in-up animation-delay-200">
          <div className="relative">
            {/* Soft Ambient Shadow Glow behind Demo */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-500/30 blur-2xl opacity-70 animate-pulse" />
            <div className="relative">
              <ArchitectureDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
