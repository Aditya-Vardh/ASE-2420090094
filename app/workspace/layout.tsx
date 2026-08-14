"use client";

import { useState } from "react";
import LineSidebar, { SidebarToggle } from "@/components/workspace/LineSidebar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="workspace-ambient flex h-screen min-h-screen overflow-hidden text-foreground">
      <LineSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="workspace-mobile-bar lg:hidden">
          <SidebarToggle onClick={() => setSidebarOpen(true)} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">ArchiGen</span>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400/80">Architecture AI</span>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
