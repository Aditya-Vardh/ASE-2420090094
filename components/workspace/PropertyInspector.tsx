"use client";

import { useState } from "react";
import {
  LayoutGrid, Boxes, GitBranch, Sparkles, RefreshCw, ChevronDown, Zap, ShieldAlert, Cpu, Code2, AlertTriangle, ArrowRight, ShieldCheck, Eye, Layers, DollarSign, Activity, CheckCircle2, Play
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ArchitectureResult } from "@/lib/storage/types";
import type { ArchitectureGraph } from "@/lib/graph/types";
import { evaluateUnifiedIntelligence } from "@/lib/intelligence/engine";
import { analyzeComponentFailurePath } from "@/lib/intelligence/failure";

type Tab = "overview" | "security" | "reliability" | "failure" | "observability" | "patterns" | "cost" | "recommendations";

const TABS: { id: Tab; label: string; short: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", short: "Overview", icon: LayoutGrid },
  { id: "security", label: "Security", short: "Security", icon: ShieldCheck },
  { id: "reliability", label: "Reliability", short: "Reliability", icon: ShieldAlert },
  { id: "failure", label: "Failure Analysis", short: "Failure", icon: Activity },
  { id: "observability", label: "Observability", short: "Observe", icon: Eye },
  { id: "patterns", label: "Patterns", short: "Patterns", icon: Layers },
  { id: "cost", label: "Cost Intelligence", short: "Cost", icon: DollarSign },
  { id: "recommendations", label: "Recommendations", short: "Recs", icon: Zap },
];

type Props = {
  result: ArchitectureResult | null;
  graph?: ArchitectureGraph | null;
  selectedComponent: string | null;
  onSelectComponent: (name: string | null) => void;
  onRefine: (instruction: string) => void;
  onOptimize?: () => void;
  onSimulate?: () => void;
  onArtifacts?: () => void;
  onSelectRiskNodes?: (nodeIds: string[]) => void;
  onApplyMutation?: (mutationType: string, targetId?: string) => void;
  loading?: boolean;
  className?: string;
};

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric-bar">
      <div className="metric-bar-label">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="metric-bar-track">
        <div className="metric-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function PropertyInspector({
  result, graph, selectedComponent, onSelectComponent, onRefine, onOptimize, onSimulate, onArtifacts, onSelectRiskNodes, onApplyMutation, loading, className = "",
}: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFailureNodeId, setSelectedFailureNodeId] = useState<string>("");

  if (!result || !graph) {
    return (
      <aside className={`w-[320px] shrink-0 border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] ${className}`}>
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#7bc963]/10 shadow-[0_0_40px_rgba(123,201,99,0.15)] ring-1 ring-[#7bc963]/20">
            <Boxes className="h-8 w-8 text-[#7bc963]" />
          </div>
          <h3 className="text-[15px] font-semibold text-white">Arqen Intelligence Control Center</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)] max-w-[200px]">
            Generate an architecture graph to evaluate security, reliability, failure paths, patterns, and cost intelligence.
          </p>
        </div>
      </aside>
    );
  }

  const unifiedIntel = evaluateUnifiedIntelligence(graph);
  const effectiveFailureId = selectedFailureNodeId || graph.nodes[0]?.id || "";
  const failurePathResult = effectiveFailureId
    ? analyzeComponentFailurePath(graph, effectiveFailureId)
    : null;

  const component = selectedComponent
    ? result.explanation.components.find((c) => c.name === selectedComponent)
    : null;

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <aside className={`flex w-[320px] sm:w-[380px] shrink-0 flex-col overflow-hidden border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all ${className}`}>
      {/* Top Title Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-black/10 px-4 py-3.5">
        <div className="min-w-0 flex-1">
          <p className="inspector-label">Arqen Intelligence Control Center</p>
          <h2 className="truncate text-sm font-semibold">{graph.title}</h2>
        </div>
        <button
          type="button"
          className="inspector-mobile-tab xl:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <activeTab.icon className="h-4 w-4" />
          <span>{activeTab.short}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Primary Actions Bar */}
      <div className="grid grid-cols-3 gap-1.5 border-b border-[#dddb9d]/15 bg-[#070804] p-2">
        {onOptimize && (
          <button
            type="button"
            onClick={onOptimize}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#7bc963]/30 bg-[#7bc963]/10 py-2 text-[10px] font-bold text-[#7bc963] hover:bg-[#7bc963] hover:text-[#0a0b04] transition-all"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Optimize</span>
          </button>
        )}
        {onSimulate && (
          <button
            type="button"
            onClick={onSimulate}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#dddb9d]/20 bg-[#12140a] py-2 text-[10px] font-bold text-[#f2f1da] hover:border-[#7bc963] transition-all"
          >
            <Cpu className="h-3.5 w-3.5 text-[#7bc963]" />
            <span>Simulate</span>
          </button>
        )}
        {onArtifacts && (
          <button
            type="button"
            onClick={onArtifacts}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#dddb9d]/20 bg-[#12140a] py-2 text-[10px] font-bold text-[#c8c69d] hover:border-[#dddb9d]/40 transition-all"
          >
            <Code2 className="h-3.5 w-3.5 text-[#dddb9d]" />
            <span>Artifacts</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="inspector-body">
        <nav className={`inspector-tab-rail ${mobileOpen ? "inspector-tab-rail-open" : ""}`}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); setMobileOpen(false); }}
              className={`inspector-tab ${tab === t.id ? "inspector-tab-active" : ""}`}
              title={t.label}
              aria-label={t.label}
            >
              <t.icon className="h-4 w-4 shrink-0" />
              <span className="inspector-tab-label">{t.short}</span>
            </button>
          ))}
        </nav>

        {/* Tab Contents */}
        <div className="inspector-content">
          {component && (
            <div className="inspector-selected-card">
              <p className="inspector-selected-label">Selected Component</p>
              <p className="font-semibold text-foreground">{component.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{component.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const match = graph.nodes.find((n) => n.name === component.name);
                    setSelectedFailureNodeId(match ? match.id : component.name);
                    setTab("failure");
                  }}
                  className="inspector-action tone-amber"
                >
                  Failure Path
                </button>
                <button type="button" onClick={() => onApplyMutation?.("ADD_CACHE", component.name)} className="inspector-action tone-cyan">+ Cache</button>
              </div>
            </div>
          )}

          <div className="inspector-section">
            {/* OVERVIEW TAB */}
            {tab === "overview" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#7bc963]/30 bg-[#7bc963]/10 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7bc963]">Unified Architecture Score</span>
                    <span className="font-mono text-xl font-extrabold text-[#7bc963]">{unifiedIntel.overallHealthScore} / 100</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#c8c69d]">
                    <div>Scalability: {unifiedIntel.dimensionScores.scalability}%</div>
                    <div>Reliability: {unifiedIntel.dimensionScores.reliability}%</div>
                    <div>Security: {unifiedIntel.dimensionScores.security}%</div>
                    <div>Observability: {unifiedIntel.dimensionScores.observability}%</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#070804] p-4 space-y-2">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7bc963]">Findings Inventory</p>
                  <p className="text-xs text-[#c8c69d]">{unifiedIntel.findings.length} deterministic finding(s) detected across security, reliability, and observability.</p>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {tab === "security" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#7bc963]">Security Intelligence ({unifiedIntel.dimensionScores.security}%)</span>
                </div>
                {unifiedIntel.findings.filter((f) => f.category === "SECURITY").map((f) => (
                  <div
                    key={f.id}
                    onClick={() => onSelectRiskNodes?.(f.affectedNodes)}
                    className="rounded-2xl border border-rose-500/30 bg-[#070804] p-4 space-y-2 cursor-pointer hover:border-rose-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#f2f1da]">{f.title}</span>
                      <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-rose-400">{f.severity}</span>
                    </div>
                    <p className="text-[11px] text-[#c8c69d]">{f.description}</p>
                    <p className="text-[10px] text-[#7bc963] font-medium pt-1">💡 {f.recommendation}</p>
                  </div>
                ))}
              </div>
            )}

            {/* RELIABILITY TAB */}
            {tab === "reliability" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#7bc963]">Reliability Intelligence ({unifiedIntel.dimensionScores.reliability}%)</span>
                </div>
                {unifiedIntel.findings.filter((f) => f.category === "RELIABILITY").map((f) => (
                  <div
                    key={f.id}
                    onClick={() => onSelectRiskNodes?.(f.affectedNodes)}
                    className="rounded-2xl border border-amber-500/30 bg-[#070804] p-4 space-y-2 cursor-pointer hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#f2f1da]">{f.title}</span>
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-400">{f.severity}</span>
                    </div>
                    <p className="text-[11px] text-[#c8c69d]">{f.description}</p>
                    <p className="text-[10px] text-[#7bc963] font-medium pt-1">💡 {f.recommendation}</p>
                  </div>
                ))}
              </div>
            )}

            {/* FAILURE ANALYSIS TAB */}
            {tab === "failure" && (
              <div className="space-y-4">
                <p className="font-mono text-xs font-bold text-[#7bc963]">Failure-Path Analysis</p>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-[#8e8c6c]">Select Component to Simulate Failure</label>
                  <select
                    value={effectiveFailureId}
                    onChange={(e) => {
                      const nodeId = e.target.value;
                      setSelectedFailureNodeId(nodeId);
                      const fResult = analyzeComponentFailurePath(graph, nodeId);
                      onSelectRiskNodes?.([fResult.sourceNodeId, ...fResult.directlyAffectedNodeIds]);
                    }}
                    className="w-full rounded-xl border border-[#dddb9d]/20 bg-[#12140a] p-2.5 text-xs text-[#f2f1da] outline-none focus:border-[#7bc963]"
                  >
                    {graph.nodes.map((n) => (
                      <option key={n.id} value={n.id}>{n.name} ({n.type})</option>
                    ))}
                  </select>
                </div>

                {failurePathResult && (
                  <div className="rounded-2xl border border-amber-500/30 bg-[#070804] p-4 space-y-3">
                    <p className="text-xs font-bold text-amber-400">Cascading Path for {failurePathResult.sourceNodeName}:</p>
                    {failurePathResult.cascadingChain.length > 0 ? (
                      <p className="font-mono text-xs text-[#7bc963]">{failurePathResult.cascadingChain.join(" → ")}</p>
                    ) : (
                      <p className="font-mono text-xs text-[#8e8c6c]">No dependent path detected.</p>
                    )}
                    <p className="text-xs leading-relaxed text-[#c8c69d]">{failurePathResult.explanation}</p>
                    <div className="border-t border-[#dddb9d]/10 pt-2 text-[11px] text-[#7bc963] font-medium">
                      💡 {failurePathResult.resilienceRecommendation}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* OBSERVABILITY TAB */}
            {tab === "observability" && (
              <div className="space-y-4">
                <span className="font-mono text-xs font-bold text-[#7bc963]">Observability Telemetry ({unifiedIntel.dimensionScores.observability}%)</span>
                {unifiedIntel.findings.filter((f) => f.category === "OBSERVABILITY").map((f) => (
                  <div key={f.id} className="rounded-2xl border border-[#dddb9d]/15 bg-[#070804] p-4 space-y-2">
                    <p className="font-bold text-xs text-[#f2f1da]">{f.title}</p>
                    <p className="text-[11px] text-[#c8c69d]">{f.description}</p>
                    <p className="text-[10px] text-[#7bc963]">💡 {f.recommendation}</p>
                  </div>
                ))}
              </div>
            )}

            {/* PATTERNS TAB */}
            {tab === "patterns" && (
              <div className="space-y-4">
                <span className="font-mono text-xs font-bold text-[#7bc963]">Detected Architecture Patterns ({unifiedIntel.patterns.length})</span>
                {unifiedIntel.patterns.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-[#7bc963]/30 bg-[#070804] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#f2f1da]">{p.name}</span>
                      <span className="rounded bg-[#7bc963]/20 px-2 py-0.5 font-mono text-[9px] font-bold text-[#7bc963]">{p.confidence} Confidence</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-[#c8c69d]">
                      {p.evidence.map((ev, idx) => (
                        <li key={idx}>• {ev}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* COST TAB */}
            {tab === "cost" && (
              <div className="space-y-4">
                {unifiedIntel.cost.map((c, idx) => (
                  <div key={idx} className="rounded-2xl border border-[#dddb9d]/15 bg-[#070804] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#8e8c6c]">Infrastructure Cost Tier:</span>
                      <span className="font-bold text-sm text-[#7bc963]">{c.costTier}</span>
                    </div>
                    <p className="text-xs text-[#c8c69d]">{c.tradeoffExplanation}</p>
                    <div>
                      <p className="font-mono text-[10px] uppercase text-[#8e8c6c] mb-1">Primary Drivers:</p>
                      <ul className="space-y-1 text-[11px] text-[#f2f1da]">
                        {c.primaryDrivers.map((d, i) => (
                          <li key={i}>• {d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RECOMMENDATIONS TAB */}
            {tab === "recommendations" && (
              <div className="space-y-4">
                <span className="font-mono text-xs font-bold text-[#7bc963]">Architectural Recommendations ({unifiedIntel.recommendations.length})</span>
                {unifiedIntel.recommendations.map((rec) => (
                  <div key={rec.id} className="rounded-2xl border border-[#7bc963]/30 bg-[#070804] p-4 space-y-3">
                    <p className="font-bold text-xs text-[#f2f1da]">{rec.title}</p>
                    <div className="space-y-1 text-[11px] text-[#c8c69d]">
                      <p><strong className="text-[#f2f1da]">Problem:</strong> {rec.decision.problem}</p>
                      <p><strong className="text-[#7bc963]">Decision:</strong> {rec.decision.decision}</p>
                      <p><strong className="text-[#f2f1da]">Benefit:</strong> {rec.decision.benefit}</p>
                      <p><strong className="text-[#8e8c6c]">Trade-off:</strong> {rec.decision.tradeoff}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onApplyMutation?.(rec.mutationType, rec.targetNodeId)}
                      className="w-full rounded-xl bg-[#7bc963] py-2 text-xs font-bold text-[#0a0b04] hover:bg-[#7bc963]/90 transition-all"
                    >
                      Apply Recommendation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
