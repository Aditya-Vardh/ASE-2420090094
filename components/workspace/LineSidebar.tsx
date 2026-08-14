"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard, FolderOpen, History, LayoutTemplate, Search, Settings,
  Plus, X, Menu, Layers, ChevronLeft, ChevronRight, GitBranch, Sparkles,
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
        className={`${width} ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 lg:static bg-[#0a0b04] border-r border-[#dddb9d]/15 backdrop-blur-2xl`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-5 border-b border-[#dddb9d]/15">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={onClose}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#dddb9d] via-[#7bc963] to-[#567f2b] p-[1px] shadow-[0_0_20px_rgba(123,201,99,0.3)]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0a0b04]">
                <Image src="/icon.svg" alt="ArchiGen Logo" width={22} height={22} className="rounded" />
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-[#f2f1da]">ArchiGen AI</p>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-[#7bc963]">Studio Pro</p>
              </div>
            )}
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-[#8e8c6c] hover:bg-[#dddb9d]/10 hover:text-[#f2f1da] transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button type="button" onClick={onClose} className="lg:hidden h-7 w-7 flex items-center justify-center rounded-lg text-[#8e8c6c] hover:bg-[#dddb9d]/10 hover:text-[#f2f1da]" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation items (hidden scrollbar for clean look) */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="mb-2 px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8e8c6c]">
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
                      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                        active 
                          ? "bg-gradient-to-r from-[#dddb9d]/15 via-[#7bc963]/15 to-[#567f2b]/10 text-[#f2f1da] border border-[#dddb9d]/30 shadow-[0_0_20px_rgba(123,201,99,0.15)]" 
                          : "text-[#c8c69d] hover:bg-[#dddb9d]/10 hover:text-[#f2f1da]"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#7bc963] shadow-[0_0_10px_#7bc963]" />
                      )}
                      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#7bc963]" : "text-[#8e8c6c]"}`} />
                      {!collapsed && <span className="truncate">{label}</span>}
                      {!collapsed && badge && (
                        <span className="ml-auto rounded-full bg-[#7bc963]/20 border border-[#7bc963]/30 px-2 py-0.5 font-mono text-[9px] font-bold text-[#7bc963]">
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

        {/* Footer User Avatar */}
        {!collapsed && (
          <div className="p-4 border-t border-[#dddb9d]/15">
            <div className="flex items-center gap-3 rounded-2xl bg-[#12140a] p-3 border border-[#dddb9d]/15">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#dddb9d] via-[#7bc963] to-[#567f2b] p-[1px] shadow-[0_0_15px_rgba(123,201,99,0.3)]">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0a0b04]">
                  <Image src="/icon.svg" alt="Pro AI Avatar" width={18} height={18} className="rounded" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#f2f1da]">Architect User</p>
                <p className="truncate text-[10px] text-[#7bc963] flex items-center gap-1">
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
    <button type="button" onClick={onClick} className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-[#dddb9d]/20 bg-[#12140a] text-[#c8c69d] hover:text-[#f2f1da]" aria-label="Open navigation">
      <Menu className="h-5 w-5" />
    </button>
  );
}
