"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type ChromaItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
  badge?: string;
  accent?: "cyan" | "violet" | "amber" | "emerald" | "rose" | "blue";
  visual?: ReactNode;
  onClick?: () => void;
};

export default function ChromaGrid({ items }: { items: ChromaItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const cls = "group relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#dddb9d]/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(123,201,99,0.15)] flex flex-col justify-between";
        const body = (
          <>
            {/* Dark pattern background texture */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#7bc963]/15 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/30 to-transparent" />

            <div className="relative z-10">
              {item.badge && (
                <span className="mb-3 inline-block rounded-full border border-[#dddb9d]/20 bg-[#dddb9d]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#dddb9d]">
                  {item.badge}
                </span>
              )}
              {item.visual && <div className="mb-4 overflow-hidden rounded-2xl border border-[#dddb9d]/10 bg-[#070804] p-3">{item.visual}</div>}
              <h3 className="mb-2 text-lg font-bold text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">{item.title}</h3>
              <p className="text-xs leading-relaxed text-[#c8c69d]">{item.description}</p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-[#dddb9d]/10 flex items-center justify-between text-xs font-bold text-[#7bc963] group-hover:text-[#91e577]">
              <span>Select Blueprint</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </>
        );

        if (item.href) {
          return (
            <Link key={item.id} href={item.href} className={cls}>
              {body}
            </Link>
          );
        }
        return (
          <button key={item.id} type="button" onClick={item.onClick} className={`${cls} text-left`}>
            {body}
          </button>
        );
      })}
    </div>
  );
}

export type { ChromaItem };
