"use client";

import { useState, Suspense } from "react";
import LineSidebar, { SidebarToggle } from "@/components/workspace/LineSidebar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="workspace-ambient flex h-screen min-h-screen overflow-hidden text-foreground bg-background">
      <Suspense fallback={<div className="w-[260px] bg-background border-r border-[#dddb9d]/15" />}>
        <LineSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Suspense>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="workspace-mobile-bar lg:hidden border-b border-[#dddb9d]/15 bg-background px-4 py-3 flex items-center gap-3">
          <SidebarToggle onClick={() => setSidebarOpen(true)} />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">ArchiGen</span>
            <span className="text-[10px] uppercase tracking-widest text-[#7bc963] font-mono">Architecture AI</span>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
