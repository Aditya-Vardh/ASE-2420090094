"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function LandingCTA() {
  return (
    <section className="relative px-4 py-28 sm:px-8 lg:py-36 overflow-hidden">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#dddb9d]/20 bg-gradient-to-b from-[#12140a]/95 via-[#0d0f06]/98 to-[#0a0b04] p-8 sm:p-14 lg:p-20 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(123,201,99,0.2)]">
        {/* Dot pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#7bc963]/18 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[#567f2b]/18 blur-3xl" />
        {/* Top accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#7bc963]/50 to-transparent" />

        <div className="relative z-10 text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/35 bg-[#7bc963]/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#7bc963] animate-pulse" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7bc963]">
              Free &amp; Open Workspace · No Login Required
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl lg:text-6xl">
            Ready to Architect Your{" "}
            <span className="bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] bg-clip-text text-transparent">
              Next System?
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-base text-[#c8c69d] sm:text-lg">
            Turn system descriptions into exportable UML diagrams, component graphs,
            and adaptive architectural insights in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/workspace/generate?new=1"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] px-9 py-4 text-sm font-bold text-[#0a0b04] shadow-[0_0_35px_rgba(123,201,99,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(123,201,99,0.6)]"
            >
              <Sparkles className="h-4 w-4" />
              Launch Architecture Studio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/workspace/templates"
              className="inline-flex items-center gap-2 rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/05 px-8 py-4 text-sm font-semibold text-[#c8c69d] backdrop-blur-xl transition-all duration-200 hover:border-[#dddb9d]/40 hover:bg-[#dddb9d]/10 hover:text-[#f2f1da]"
            >
              Explore Templates
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-[#8e8c6c]">
            <ShieldCheck className="h-4 w-4 text-[#7bc963]" />
            <span>Local privacy guaranteed · Export to SVG, PNG, Markdown</span>
          </div>
        </div>
      </div>
    </section>
  );
}
