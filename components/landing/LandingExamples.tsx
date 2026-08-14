"use client";

import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";
import { ArrowRight, ShoppingCart, MessageSquare, Hospital, Tv, Boxes, HeartPulse, Globe, Building2, Smartphone, Database, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CardMeta = {
  icon: LucideIcon;
  iconColor: string;
  glowColor: string;
};

const CARD_META: Record<string, CardMeta> = {
  ecommerce:      { icon: ShoppingCart, iconColor: "text-cyan-400",    glowColor: "from-cyan-500/20 to-blue-500/5" },
  chat:           { icon: MessageSquare, iconColor: "text-indigo-400",  glowColor: "from-indigo-500/20 to-violet-500/5" },
  hospital:       { icon: Hospital,     iconColor: "text-rose-400",    glowColor: "from-rose-500/20 to-pink-500/5" },
  streaming:      { icon: Tv,           iconColor: "text-amber-400",   glowColor: "from-amber-500/20 to-orange-500/5" },
  microservices:  { icon: Boxes,        iconColor: "text-purple-400",  glowColor: "from-purple-500/20 to-indigo-500/5" },
  "ai-app":       { icon: HeartPulse,   iconColor: "text-emerald-400", glowColor: "from-emerald-500/20 to-teal-500/5" },
  "social-media": { icon: Globe,        iconColor: "text-sky-400",      glowColor: "from-sky-500/20 to-cyan-500/5" },
  banking:        { icon: Building2,    iconColor: "text-yellow-400",  glowColor: "from-yellow-500/20 to-amber-500/5" },
  "food-delivery":{ icon: Smartphone,   iconColor: "text-orange-400",  glowColor: "from-orange-500/20 to-red-500/5" },
  saas:           { icon: Database,     iconColor: "text-violet-400",  glowColor: "from-violet-500/20 to-purple-500/5" },
};

const DEFAULT_META: CardMeta = { icon: Boxes, iconColor: "text-slate-400", glowColor: "from-white/10 to-transparent" };

export default function LandingExamples() {
  const featured = TEMPLATES.slice(0, 6);

  return (
    <section id="examples" className="relative border-t border-white/[0.08] px-4 py-28 sm:px-8 lg:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                Starter Architectures
              </span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Start From Proven <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                Production Blueprints
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-slate-400">
              Pick a pre-designed architecture template, customize it for your needs, 
              and generate complete Mermaid diagrams immediately.
            </p>
          </div>

          <Link
            href="/workspace/templates"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/[0.08]"
          >
            Browse All Templates
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => {
            const meta = CARD_META[t.id] ?? DEFAULT_META;
            const Icon = meta.icon;
            return (
              <Link
                key={t.id}
                href={`/workspace/generate?template=${t.id}`}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.15)] flex flex-col justify-between"
              >
                <div className={`pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br ${meta.glowColor} blur-2xl opacity-0 transition-opacity group-hover:opacity-100`} />

                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] ${meta.iconColor} group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {t.category}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400 line-clamp-2">
                    {t.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
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
