"use client";

import { useState } from "react";
import { Sparkles, Code2, Layers, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

type Node = {
  id: string;
  label: string;
  sub: string;
  color: string;
  y: number;
};

const NODES: Node[] = [
  { id: "user", label: "Client App", sub: "React / Next.js", color: "#22D3EE", y: 20 },
  { id: "gateway", label: "API Gateway", sub: "Traefik / Kong", color: "#818CF8", y: 84 },
  { id: "auth", label: "Auth & Identity", sub: "OAuth2 / JWT", color: "#F43F5E", y: 148 },
  { id: "core", label: "Core Service", sub: "Node.js Microservice", color: "#A855F7", y: 212 },
  { id: "db", label: "Primary DB", sub: "PostgreSQL 16", color: "#F59E0B", y: 276 },
  { id: "cache", label: "Redis Cluster", sub: "Sub-ms Cache", color: "#10B981", y: 340 },
  { id: "ai", label: "AI Engine", sub: "Groq / OpenAI API", color: "#EC4899", y: 404 },
];

const CX = 190;
const NW = 170;
const NH = 46;

export default function ArchitectureDemo() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tab, setTab] = useState<"visual" | "code">("visual");

  function isConnected(id: string) {
    if (!hovered) return false;
    const idx = NODES.findIndex((n) => n.id === id);
    const hIdx = NODES.findIndex((n) => n.id === hovered);
    return Math.abs(idx - hIdx) <= 1;
  }

  const sampleMermaid = `graph TD
    A[Client App] -->|HTTPS| B(API Gateway)
    B --> C{Auth Service}
    B --> D[Core Service]
    D --> E[(PostgreSQL)]
    D --> F[(Redis Cache)]
    D --> G[AI Engine]`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0C14]/90 p-1 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.15)]">
      {/* Decorative gradient glowing bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0E101A] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-[11px] font-medium text-slate-400">
            archigen-canvas.sys
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5">
            <button
              type="button"
              onClick={() => setTab("visual")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                tab === "visual"
                  ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-3 w-3" />
              Diagram
            </button>
            <button
              type="button"
              onClick={() => setTab("code")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                tab === "code"
                  ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code2 className="h-3 w-3" />
              Mermaid
            </button>
          </div>

          <div className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 sm:flex border border-emerald-500/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-400">99.8% Optimized</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {tab === "visual" ? (
        <div className="relative bg-[#07080F] p-4 sm:p-6">
          {/* Floating feature pills */}
          <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-[#0E101D]/80 px-3 py-1 text-[10px] text-slate-300 backdrop-blur-md">
            <Zap className="h-3 w-3 text-cyan-400" /> Real-time Node Sync
          </div>
          <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-[#0E101D]/80 px-3 py-1 text-[10px] text-slate-300 backdrop-blur-md">
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> Auto-Validated
          </div>

          <svg viewBox="0 0 380 470" className="mx-auto w-full max-w-sm" role="img" aria-label="Interactive architecture preview">
            <defs>
              <linearGradient id="flowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#6366F1" stopOpacity="1" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {NODES.slice(0, -1).map((node, i) => {
              const next = NODES[i + 1];
              const active = hovered === node.id || hovered === next.id;
              const y1 = node.y + NH;
              const y2 = next.y;
              return (
                <g key={`edge-${node.id}`}>
                  <line
                    x1={CX} y1={y1} x2={CX} y2={y2}
                    stroke={active ? "url(#flowGrad)" : "rgba(255,255,255,0.12)"}
                    strokeWidth={active ? 3 : 1.5}
                    strokeDasharray={active ? undefined : "4 4"}
                  />
                  <circle r="3.5" fill="#22D3EE" opacity={active ? 1 : 0.4}>
                    <animateMotion dur={`${1.6 + i * 0.2}s`} repeatCount="indefinite" path={`M${CX},${y1} L${CX},${y2}`} />
                  </circle>
                </g>
              );
            })}

            {NODES.map((node) => {
              const isHovered = hovered === node.id;
              const connected = isConnected(node.id);
              const x = CX - NW / 2;
              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  <rect
                    x={x} y={node.y} width={NW} height={NH} rx="10"
                    fill={isHovered ? "#141726" : "#0E101A"}
                    stroke={isHovered || connected ? node.color : "rgba(255,255,255,0.12)"}
                    strokeWidth={isHovered ? 2 : 1}
                    filter={isHovered ? "url(#glow)" : undefined}
                  />
                  <rect x={x + 12} y={node.y} width={NW - 24} height={2} rx="1" fill={node.color} />
                  <text x={CX} y={node.y + 21} textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="700">
                    {node.label}
                  </text>
                  <text x={CX} y={node.y + 35} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="var(--font-geist-mono)">
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-2 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 px-4 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Interactive Nodes</span>
            </div>
            <span className="text-slate-400">Hover over any component</span>
          </div>
        </div>
      ) : (
        <div className="relative bg-[#07080F] p-5 font-mono text-xs text-cyan-300 min-h-[460px] overflow-x-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Generated Mermaid.js</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Valid Syntax
            </span>
          </div>
          <pre className="leading-relaxed">{sampleMermaid}</pre>
        </div>
      )}
    </div>
  );
}
