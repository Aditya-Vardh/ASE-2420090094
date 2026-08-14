"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GitBranch } from "lucide-react";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#templates", label: "Templates" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`landing-nav fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "landing-nav-scrolled" : ""}`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
            <GitBranch className="h-4 w-4 text-slate-950" />
          </div>
          <span className="text-sm font-semibold tracking-tight">ArchiGen AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="landing-nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/workspace" className="landing-btn-ghost hidden sm:inline-flex">
            Sign in
          </Link>
          <Link href="/workspace/generate?new=1" className="landing-btn-primary">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
