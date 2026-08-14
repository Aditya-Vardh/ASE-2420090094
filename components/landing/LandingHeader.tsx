"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "/workspace/templates", label: "Templates" },
  { href: "/workspace/uml", label: "UML Generator" },
];

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.08] bg-[#06060B]/80 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "border-b border-white/[0.03] bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#090A10]">
              <Image src="/icon.svg" alt="ArchiGen Logo" width={22} height={22} className="rounded-md" aria-hidden />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              ArchiGen<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </span>
            <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400 -mt-1">
              Architecture Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1.5 backdrop-blur-xl md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:text-white hover:bg-white/[0.08]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/workspace"
            className="text-xs font-medium text-slate-300 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/workspace/generate?new=1"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 p-[1px] text-xs font-semibold text-white shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)]"
          >
            <span className="flex items-center gap-2 rounded-full bg-[#090A10] px-4 py-2 transition-colors group-hover:bg-transparent">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 group-hover:text-white transition-colors" />
              Launch Studio
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 md:hidden hover:text-white"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="animate-fade-in border-t border-white/[0.08] bg-[#06060B]/95 backdrop-blur-2xl px-5 py-6 md:hidden">
          <div className="flex flex-col gap-2">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/workspace"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm font-medium text-slate-300 transition-all hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/workspace/generate?new=1"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                <Sparkles className="h-4 w-4" />
                Launch Studio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
