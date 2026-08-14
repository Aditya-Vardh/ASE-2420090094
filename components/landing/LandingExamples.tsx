"use client";

import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";
import { ArrowRight, ShoppingCart, MessageSquare, Hospital, Tv, Boxes, HeartPulse, Globe, Building2, Smartphone, Database, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CardMeta = {
  icon: LucideIcon;
  iconClass: string;
  glowClass: string;
};

const CARD_META: Record<string, CardMeta> = {
  ecommerce:       { icon: ShoppingCart, iconClass: "text-[#7bc963]",   glowClass: "from-[#7bc963]/20 to-[#567f2b]/5" },
  chat:            { icon: MessageSquare, iconClass: "text-[#dddb9d]",  glowClass: "from-[#dddb9d]/20 to-[#c8c69d]/5" },
  hospital:        { icon: Hospital,     iconClass: "text-[#7bc963]",   glowClass: "from-[#7bc963]/15 to-[#567f2b]/5" },
  streaming:       { icon: Tv,           iconClass: "text-[#dddb9d]",   glowClass: "from-[#dddb9d]/15 to-[#c8c69d]/5" },
  microservices:   { icon: Boxes,        iconClass: "text-[#7bc963]",   glowClass: "from-[#567f2b]/20 to-[#7bc963]/5" },
  "ai-app":        { icon: HeartPulse,   iconClass: "text-[#dddb9d]",   glowClass: "from-[#dddb9d]/15 to-[#7bc963]/5" },
  "social-media":  { icon: Globe,        iconClass: "text-[#7bc963]",   glowClass: "from-[#7bc963]/15 to-[#567f2b]/5" },
  banking:         { icon: Building2,    iconClass: "text-[#dddb9d]",   glowClass: "from-[#dddb9d]/20 to-[#c8c69d]/5" },
  "food-delivery": { icon: Smartphone,   iconClass: "text-[#7bc963]",   glowClass: "from-[#7bc963]/15 to-[#567f2b]/5" },
  saas:            { icon: Database,     iconClass: "text-[#dddb9d]",   glowClass: "from-[#dddb9d]/15 to-[#7bc963]/5" },
};

const DEFAULT_META: CardMeta = { icon: Boxes, iconClass: "text-[#8e8c6c]", glowClass: "from-[#dddb9d]/10 to-transparent" };

export default function LandingExamples() {
  const featured = TEMPLATES.slice(0, 6);

  return (
    <section id="examples" className="relative border-t border-[#dddb9d]/10 px-4 py-28 sm:px-8 lg:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dddb9d]/30 bg-[#dddb9d]/10 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#dddb9d]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#dddb9d]">
                Starter Architectures
              </span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl">
              Start From Proven <br />
              <span className="bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] bg-clip-text text-transparent">
                Production Blueprints
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-[#c8c69d]">
              Pick a pre-designed architecture template, customize it for your needs,
              and generate complete Mermaid diagrams immediately.
            </p>
          </div>

          <Link
            href="/workspace/templates"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/08 px-6 py-3 text-sm font-semibold text-[#c8c69d] transition-all hover:border-[#dddb9d]/40 hover:text-[#f2f1da]"
          >
            Browse All Templates
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => {
            const meta = CARD_META[t.id] ?? DEFAULT_META;
            const Icon = meta.icon;
            return (
              <Link
                key={t.id}
                href={`/workspace/generate?template=${t.id}`}
                className="group relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#dddb9d]/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(123,201,99,0.15)] flex flex-col justify-between"
              >
                {/* Dot pattern */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
                {/* Top accent line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/30 to-transparent" />
                {/* Corner glow on hover */}
                <div className={`pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br ${meta.glowClass} blur-2xl opacity-0 transition-opacity group-hover:opacity-100`} />

                <div className="relative z-10">
                  <div className="mb-5 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dddb9d]/15 bg-[#dddb9d]/08 ${meta.iconClass} group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/08 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#c8c69d]">
                      {t.category}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold tracking-tight text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#c8c69d] line-clamp-2">
                    {t.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center gap-2 text-xs font-semibold text-[#7bc963] group-hover:text-[#91e577]">
                  <span>Load Template</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
