"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers } from "lucide-react";
import ArchitectureDemo from "./ArchitectureDemo";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:pb-36 lg:pt-32">
      {/* Ambient glow orbs — brand palette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-tr from-[#7bc963]/20 via-[#dddb9d]/15 to-[#567f2b]/20 blur-[140px]" />
        <div className="absolute right-[-10%] top-1/4 h-[450px] w-[550px] rounded-full bg-[#567f2b]/12 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[350px] w-[450px] rounded-full bg-[#7bc963]/12 blur-[100px]" />
      </div>

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.06]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Left Column */}
        <div className="animate-fade-in-up">
          {/* Eyebrow Pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/35 bg-[#7bc963]/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(123,201,99,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-[#7bc963] animate-pulse" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7bc963]">
              Next-Gen AI Architecture Engine
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-5xl font-extrabold leading-[1.04] tracking-tight text-[#f2f1da] sm:text-6xl lg:text-7xl xl:text-[5rem]">
            Describe it.{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(123,201,99,0.3)]">
              Architect it.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mb-8 max-w-xl text-base leading-relaxed text-[#c8c69d] sm:text-lg">
            Turn system descriptions into production-ready software architecture diagrams,
            microservice maps, and UML specifications in seconds with AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/workspace/generate?new=1"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-8 py-4 text-sm font-bold text-[#0a0b04] shadow-[0_0_35px_rgba(123,201,99,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(123,201,99,0.6)]"
            >
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              Generate Architecture Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/workspace/templates"
              className="inline-flex items-center gap-2 rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/05 px-7 py-4 text-sm font-semibold text-[#c8c69d] backdrop-blur-xl transition-all duration-200 hover:border-[#dddb9d]/40 hover:bg-[#dddb9d]/10 hover:text-[#f2f1da]"
            >
              <Layers className="h-4 w-4 text-[#8e8c6c]" />
              Explore Templates
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#dddb9d]/12 pt-6">
            <div className="flex items-center gap-2 text-xs font-medium text-[#c8c69d]">
              <ShieldCheck className="h-4 w-4 text-[#7bc963]" />
              <span>Production Ready</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#c8c69d]">
              <Zap className="h-4 w-4 text-[#dddb9d]" />
              <span>Instant Mermaid Export</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#c8c69d]">
              <Sparkles className="h-4 w-4 text-[#7bc963]" />
              <span>Adaptive AI Insights</span>
            </div>
          </div>
        </div>

        {/* Right Column: Demo Visual */}
        <div className="animate-fade-in-up animation-delay-200">
          <div className="relative">
            {/* Glow behind demo */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#7bc963]/25 via-[#dddb9d]/20 to-[#567f2b]/25 blur-2xl opacity-70 animate-pulse" />
            <div className="relative">
              <ArchitectureDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
