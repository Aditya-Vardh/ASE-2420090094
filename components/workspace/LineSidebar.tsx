"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard, FolderOpen, History, LayoutTemplate, Search, Settings,
  Plus, X, Menu, Layers, Bot, ChevronLeft, ChevronRight, GitBranch, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean; badge?: string };

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "CORE WORKSPACE",
    items: [
      { href: "/workspace", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/workspace/generate?new=1", label: "New Architecture", icon: Plus, badge: "AI" },
      { href: "/workspace/projects", label: "My Projects", icon: FolderOpen },
      { href: "/workspace/history", label: "History Log", icon: History },
    ],
  },
  {
    title: "CREATIVE & UML",
    items: [
      { href: "/workspace/generate", label: "Studio Canvas", icon: Layers },
      { href: "/workspace/uml", label: "UML Generator", icon: GitBranch },
      { href: "/workspace/templates", label: "Template Library", icon: LayoutTemplate },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { href: "/workspace/research", label: "AI Research", icon: Search },
    ],
  },
  {
    title: "SYSTEM",
    items: [{ href: "/workspace/settings", label: "Settings", icon: Settings }],
  },
];

type Props = { open: boolean; onClose: () => void };

export default function LineSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string, exact?: boolean) {
    const base = href.split("?")[0];
    if (exact || base === "/workspace") return pathname === base;
    if (base === "/workspace/generate") {
      return pathname.startsWith("/workspace/generate") && !pathname.startsWith("/workspace/uml");
    }
    return pathname.startsWith(base);
  }

  const width = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <>
      {open && (
        <button type="button" className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={onClose} aria-label="Close navigation" />
      )}

      <aside
        className={`${width} ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 lg:static bg-[#080911]/90 border-r border-white/[0.08] backdrop-blur-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-5 border-b border-white/[0.08]">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={onClose}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#090A10]">
                <Image src="/icon.svg" alt="ArchiGen" width={20} height={20} className="rounded" />
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-white">ArchiGen AI</p>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-cyan-400">Studio Pro</p>
              </div>
            )}
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button type="button" onClick={onClose} className="lg:hidden h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="mb-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map(({ href, label, icon: Icon, exact, badge }) => {
                  const active = isActive(href, exact);
                  return (
                    <Link
                      key={`${section.title}-${label}`}
                      href={href}
                      onClick={onClose}
                      title={collapsed ? label : undefined}
                      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                        active 
                          ? "bg-gradient-to-r from-cyan-400/15 via-indigo-500/15 to-purple-500/10 text-white border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]" 
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#22D3EE]" />
                      )}
                      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-cyan-400" : "text-slate-400"}`} />
                      {!collapsed && <span className="truncate">{label}</span>}
                      {!collapsed && badge && (
                        <span className="ml-auto rounded-full bg-cyan-400/20 border border-cyan-400/30 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-300">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3 border border-white/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-md">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">Architect User</p>
                <p className="truncate text-[10px] text-cyan-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Pro AI Activated
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white" aria-label="Open navigation">
      <Menu className="h-5 w-5" />
    </button>
  );
}
