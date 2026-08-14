"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const githubUrl =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/Aditya-Vardh/ASE-2420090094";

const FOOTER_LINKS = [
  {
    title: "Product Workspace",
    items: [
      { label: "Dashboard Hub", href: "/workspace" },
      { label: "Studio Canvas", href: "/workspace/generate" },
      { label: "Starter Blueprints", href: "/workspace/templates" },
      { label: "UML Generator", href: "/workspace/uml" },
      { label: "AI Research Assistant", href: "/workspace/research" },
    ],
  },
  {
    title: "Tools & Docs",
    items: [
      { label: "GitHub Repository", href: githubUrl, external: true },
      { label: "System How-It-Works", href: "#how-it-works" },
      { label: "Architecture Blueprints", href: "#examples" },
      { label: "Workspace Settings", href: "/workspace/settings" },
    ],
  },
  {
    title: "Capabilities",
    items: [
      { label: "Mermaid SVG Canvas", href: "/workspace/generate" },
      { label: "Structural Audit", href: "/workspace" },
      { label: "SVG, PNG & MD Exports", href: "/workspace/generate" },
      { label: "In-Browser Privacy Storage", href: "/workspace/history" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#dddb9d]/10 bg-[#050603]/90 backdrop-blur-2xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* Main Grid */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="sm:col-span-2">
            <Link href="/" className="group mb-4 inline-flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#dddb9d] via-[#7bc963] to-[#567f2b] p-[1px] shadow-[0_0_20px_rgba(123,201,99,0.3)]">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0a0b04]">
                  <Image src="/icon.svg" alt="Arqen Logo" width={22} height={22} className="rounded-md" aria-hidden />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-[#f2f1da] group-hover:text-[#7bc963] transition-colors">
                  Arqen<span className="text-[#7bc963]">AI</span>
                </span>
                <span className="text-[9px] font-semibold tracking-widest uppercase text-[#8e8c6c] -mt-1">
                  Design · Intelligence · Future
                </span>
              </div>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#8e8c6c]">
              Turn system descriptions into exportable UML diagrams, microservice maps,
              and architectural specifications in seconds.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dddb9d]/15 bg-[#12140a] text-[#8e8c6c] transition-all hover:border-[#dddb9d]/35 hover:bg-[#1a1d0e] hover:text-[#f2f1da]"
                aria-label="GitHub Repository"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#8e8c6c]">
                {col.title}
              </p>
              <ul className="space-y-2.5 text-xs">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {"external" in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8e8c6c] transition-colors hover:text-[#7bc963]"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-[#8e8c6c] transition-colors hover:text-[#7bc963]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Status Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#dddb9d]/10 py-6 sm:flex-row">
          <p className="text-xs text-[#8e8c6c]">
            © {new Date().getFullYear()} Arqen AI · Designed &amp; Built with ❤️ by{" "}
            <span className="font-bold text-[#7bc963]">Aditya Vardhan</span>
          </p>
          <div className="flex items-center gap-2 rounded-full border border-[#7bc963]/20 bg-[#7bc963]/10 px-3 py-1 text-xs text-[#7bc963]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#7bc963]" />
            <Sparkles className="h-3 w-3" />
            <span>Synthesis Engine Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
