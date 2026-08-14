"use client";

import { useState } from "react";
import {
  LayoutGrid, Boxes, GitBranch, Sparkles, RefreshCw, ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ArchitectureResult } from "@/lib/storage/types";
import { deriveAdaptiveInsights, healthTone } from "@/lib/adaptive";
import GlassSurface from "@/components/ui/GlassSurface";
import ReflectiveCard from "@/components/ui/ReflectiveCard";

type Tab = "overview" | "components" | "dataFlow" | "insights" | "adaptation";

const TABS: { id: Tab; label: string; short: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", short: "Overview", icon: LayoutGrid },
  { id: "components", label: "Components", short: "Parts", icon: Boxes },
  { id: "dataFlow", label: "Data Flow", short: "Flow", icon: GitBranch },
  { id: "insights", label: "Insights", short: "AI", icon: Sparkles },
  { id: "adaptation", label: "Adaptation", short: "Adapt", icon: RefreshCw },
];

type Props = {
  result: ArchitectureResult | null;
  selectedComponent: string | null;
  onSelectComponent: (name: string | null) => void;
  onRefine: (instruction: string) => void;
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
  result, selectedComponent, onSelectComponent, onRefine, loading, className = "",
}: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!result) {
    return (
      <aside className={`w-[320px] shrink-0 border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] ${className}`}>
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20">
            <Boxes className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="text-[15px] font-semibold text-white">Context Panel</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)] max-w-[200px]">
            Generate an architecture to inspect components, metrics, and AI recommendations.
          </p>
        </div>
      </aside>
    );
  }

  const { explanation, technologies } = result;
  const insights = deriveAdaptiveInsights(result);
  const tone = healthTone(insights.health);
  const reflectiveTone = tone === "excellent" || tone === "good" ? "emerald" : tone === "fair" ? "amber" : "rose";
  const component = selectedComponent
    ? explanation.components.find((c) => c.name === selectedComponent)
    : null;
  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <aside className={`flex w-[320px] shrink-0 flex-col overflow-hidden border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all ${className}`}>
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-black/10 px-4 py-4">
        <div className="min-w-0 flex-1">
          <p className="inspector-label">Inspector</p>
          <h2 className="truncate text-sm font-semibold">{result.title}</h2>
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

        <div className="inspector-content">
          {component && (
            <div className="inspector-selected-card">
              <p className="inspector-selected-label">Selected</p>
              <p className="font-semibold text-foreground">{component.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{component.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" disabled={loading} onClick={() => onRefine(`Explain ${component.name} in detail`)} className="inspector-action tone-cyan">Explain</button>
                <button type="button" disabled={loading} onClick={() => onRefine(`Improve ${component.name}`)} className="inspector-action tone-violet">Improve</button>
                <button type="button" disabled={loading} onClick={() => onRefine(`Regenerate ${component.name} with better design`)} className="inspector-action tone-amber">Regenerate</button>
              </div>
            </div>
          )}

          <div className="inspector-section">
            {tab === "overview" && (
              <div className="space-y-4">
                <ReflectiveCard
                  title="Architecture Health"
                  subtitle={insights.healthLabel}
                  score={insights.health}
                  tone={reflectiveTone}
                >
                  <MetricBar label="Scalability" value={insights.scalability} />
                  <MetricBar label="Reliability" value={insights.reliability} />
                  <MetricBar label="Maintainability" value={insights.maintainability} />
                  <MetricBar label="Security" value={insights.security} />
                </ReflectiveCard>

                {/* UML Diagram Specification Breakdown */}
                <div className="rounded-2xl border border-[#dddb9d]/15 bg-[#070804] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7bc963]">UML Specification</span>
                    <span className="rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#7bc963] uppercase">
                      {result.diagramType}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#f2f1da]">{explanation.components.length} Subsystem Components</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {technologies.map((tech) => (
                      <span key={tech} className="rounded-md border border-[#dddb9d]/15 bg-[#12140a] px-2 py-0.5 font-mono text-[10px] text-[#c8c69d]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="inspector-text">{explanation.overview}</p>
                {explanation.technologyChoices && (
                  <div>
                    <p className="inspector-label mb-2">Technology choices</p>
                    <p className="inspector-text">{explanation.technologyChoices}</p>
                  </div>
                )}
              </div>
            )}

            {tab === "components" && (
              <ul className="inspector-list">
                {explanation.components.map((c) => (
                  <li key={c.name}>
                    <button
                      type="button"
                      onClick={() => onSelectComponent(c.name === selectedComponent ? null : c.name)}
                      className={`inspector-component ${selectedComponent === c.name ? "inspector-component-active" : ""}`}
                    >
                      <span className="font-medium text-foreground">{c.name}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted">{c.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {tab === "dataFlow" && <p className="inspector-text">{explanation.dataFlow}</p>}

            {tab === "insights" && (
              <div className="space-y-4">
                <p className="inspector-text">{explanation.improvements}</p>
                <div>
                  <p className="inspector-label mb-2">Security</p>
                  <p className="inspector-text">{explanation.security}</p>
                </div>
                <div>
                  <p className="inspector-label mb-2">Scalability</p>
                  <p className="inspector-text">{explanation.scalability}</p>
                </div>
                <div>
                  <p className="inspector-label mb-2">Trade-offs</p>
                  <p className="inspector-text">{explanation.tradeoffs}</p>
                </div>
                <div className="tech-badges">
                  {technologies.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {tab === "adaptation" && (
              <div className="space-y-4">
                <div>
                  <p className="inspector-label mb-2">Analyze → Detect → Recommend → Adapt</p>
                  <MetricBar label="Adaptability" value={insights.adaptability} />
                </div>

                {insights.potentialIssues.length > 0 && (
                  <div>
                    <p className="inspector-label mb-2">Potential issues</p>
                    <ul className="space-y-1.5">
                      {insights.potentialIssues.map((issue) => (
                        <li key={issue} className="text-xs leading-relaxed text-amber-300/90">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="inspector-label mb-2">Adaptive suggestions</p>
                  {insights.suggestions.map((s, i) => (
                    <div key={`${s.suggested}-${i}`} className="suggestion-card">
                      <div className="suggestion-flow">
                        <span className="suggestion-pill">{s.current}</span>
                        <span className="suggestion-arrow">→</span>
                        <span className="suggestion-pill">{s.suggested}</span>
                      </div>
                      <p className="suggestion-reason">{s.reason}</p>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => onRefine(`Adapt architecture: change from "${s.current}" to "${s.suggested}". Reason: ${s.reason}`)}
                        className="inspector-action tone-cyan mt-2"
                      >
                        Apply suggestion
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onRefine("Improve this architecture for scalability, maintainability, and adaptability. Prefer modular boundaries and resilient data access.")}
                  className="generate-btn-primary"
                >
                  <RefreshCw className="h-4 w-4" />
                  Improve Architecture
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
