"use client";

import { Sparkles, Layers, Cpu, Cloud, Server, Database, Lock, Globe } from "lucide-react";

const USE_CASES = [
  { name: "Microservices Architecture", icon: Server },
  { name: "Cloud Infrastructure (AWS/GCP/Azure)", icon: Cloud },
  { name: "SaaS Multi-Tenant Platforms", icon: Globe },
  { name: "AI RAG & LLM Pipelines", icon: Cpu },
  { name: "Database & ER Diagrams", icon: Database },
  { name: "System Design Interviews", icon: Layers },
  { name: "Security & Auth Systems", icon: Lock },
  { name: "Event-Driven Messaging (Kafka/RabbitMQ)", icon: Sparkles },
];

const DOUBLED = [...USE_CASES, ...USE_CASES];

export default function LandingUseCases() {
  return (
    <section className="relative border-t border-[#dddb9d]/10 py-24 bg-[#0a0b04]/80">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dddb9d]/30 bg-[#dddb9d]/10 px-4 py-1.5 backdrop-blur-md">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#dddb9d]">
            Versatile Applications
          </span>
        </div>
        <h2 className="mx-auto mb-4 max-w-3xl text-3xl font-extrabold tracking-tight text-[#f2f1da] sm:text-4xl lg:text-5xl">
          Engineered for Every Architecture Challenge
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-base text-[#c8c69d]">
          Whether you are building cloud infrastructure, microservices, database schemas,
          or preparing system design docs — ArchiGen AI adapts seamlessly.
        </p>
      </div>

      {/* Marquee Row */}
      <div className="relative overflow-hidden py-3">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#0a0b04] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#0a0b04] to-transparent" />

        <div className="flex w-max animate-marquee space-x-4">
          {DOUBLED.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.name}-${i}`}
                className="inline-flex items-center gap-3 rounded-full border border-[#dddb9d]/15 bg-[#12140a]/80 px-6 py-3 text-sm font-medium text-[#c8c69d] backdrop-blur-xl transition-colors hover:border-[#7bc963]/40 hover:bg-[#12140a] hover:text-[#f2f1da]"
              >
                <Icon className="h-4 w-4 text-[#7bc963]" />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
