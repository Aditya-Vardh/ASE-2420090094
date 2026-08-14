import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type BentoItem = {
  title: string;
  description: string;
  href?: string;
  icon?: ReactNode;
  span?: "1" | "2" | "3";
  tall?: boolean;
  visual?: ReactNode;
  accent?: "cyan" | "violet" | "amber" | "rose" | "green" | "blue";
};

export default function MagicBento({ items }: { items: BentoItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const content = (
          <>
            {/* Subtle dot pattern background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#7bc963]/15 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/30 to-transparent" />

            <div className="relative z-10">
              {item.visual && (
                <div className="mb-4 overflow-hidden rounded-2xl border border-[#dddb9d]/10 bg-[#070804] p-3">{item.visual}</div>
              )}
              {item.icon && (
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dddb9d]/15 bg-[#dddb9d]/10 text-[#7bc963] shadow-inner group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              )}
              <h3 className="mb-2 text-lg font-bold text-[#f2f1da] group-hover:text-[#7bc963] transition-colors flex items-center gap-1.5">
                {item.title}
                <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h3>
              <p className="text-xs leading-relaxed text-[#c8c69d]">{item.description}</p>
            </div>
          </>
        );

        const cls = [
          "group relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#dddb9d]/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(123,201,99,0.15)]",
          item.span === "2" ? "sm:col-span-2" : "",
          item.span === "3" ? "sm:col-span-3" : "",
          item.tall ? "row-span-2" : "",
        ].filter(Boolean).join(" ");

        return item.href ? (
          <Link key={item.title} href={item.href} className={cls}>
            {content}
          </Link>
        ) : (
          <div key={item.title} className={cls}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

export type { BentoItem };
