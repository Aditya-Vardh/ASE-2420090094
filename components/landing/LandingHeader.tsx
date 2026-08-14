"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, Sparkles, LayoutDashboard } from "lucide-react";

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
          ? "border-b border-[#dddb9d]/20 bg-[#0a0b04]/90 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "border-b border-[#dddb9d]/10 bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#dddb9d] via-[#7bc963] to-[#567f2b] p-[1px] shadow-[0_0_20px_rgba(123,201,99,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0a0b04]">
              <Image src="/icon.svg" alt="ArchiGen Logo" width={22} height={22} className="rounded-md" aria-hidden />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
              ArchiGen<span className="text-[#7bc963]">AI</span>
            </span>
            <span className="text-[9px] font-semibold tracking-widest uppercase text-[#8e8c6c] -mt-1">
              Architecture Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 rounded-full border border-[#dddb9d]/15 bg-[#12140a]/80 p-1.5 backdrop-blur-xl md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-[#c8c69d] transition-all duration-200 hover:text-[#f2f1da] hover:bg-[#dddb9d]/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/workspace"
            className="flex items-center gap-1.5 text-xs font-bold text-[#c8c69d] transition-colors hover:text-[#f2f1da]"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-[#dddb9d]" />
            Dashboard
          </Link>
          <Link
            href="/workspace"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#dddb9d] via-[#7bc963] to-[#567f2b] p-[1px] text-xs font-bold text-[#0a0b04] shadow-[0_0_25px_rgba(123,201,99,0.3)] transition-all hover:scale-[1.03]"
          >
            <span className="flex items-center gap-2 rounded-full bg-[#0a0b04] px-4 py-2 transition-colors group-hover:bg-transparent group-hover:text-[#0a0b04] text-[#f2f1da]">
              <Sparkles className="h-3.5 w-3.5 text-[#7bc963] group-hover:text-[#0a0b04] transition-colors" />
              Launch Studio
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-[#dddb9d]/20 bg-[#12140a] p-2 text-[#c8c69d] md:hidden hover:text-[#f2f1da]"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="animate-fade-in border-t border-[#dddb9d]/15 bg-[#0a0b04]/95 backdrop-blur-2xl px-5 py-6 md:hidden">
          <div className="flex flex-col gap-2">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-[#c8c69d] transition-all hover:border-[#dddb9d]/20 hover:bg-[#12140a] hover:text-[#f2f1da]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/workspace"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[#dddb9d]/20 bg-[#12140a] px-4 py-3 text-center text-sm font-medium text-[#f2f1da] transition-all hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/workspace/generate?new=1"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#dddb9d] to-[#7bc963] px-4 py-3 text-sm font-bold text-[#0a0b04] shadow-[0_0_20px_rgba(123,201,99,0.3)]"
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
