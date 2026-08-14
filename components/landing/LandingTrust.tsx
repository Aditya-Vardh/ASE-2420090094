"use client";

import { Cpu, Zap, Shield, GitBranch } from "lucide-react";

const STATS = [
  { number: "25,000+", label: "Architectures Generated", icon: Zap, color: "from-cyan-400 to-blue-500" },
  { number: "8+", label: "UML & Cloud Formats", icon: GitBranch, color: "from-indigo-400 to-violet-500" },
  { number: "< 2.5s", label: "Avg Synthesis Speed", icon: Cpu, color: "from-purple-400 to-pink-500" },
  { number: "100%", label: "Privacy & Export Ready", icon: Shield, color: "from-emerald-400 to-teal-500" },
];

export default function LandingTrust() {
  return (
    <section className="relative border-y border-white/[0.08] bg-[#0A0C14]/60 py-10 backdrop-blur-2xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5 text-cyan-400" />
                </div>
                <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl`}>
                  {stat.number}
                </div>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
