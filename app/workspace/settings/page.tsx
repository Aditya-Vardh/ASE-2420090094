"use client";

import { useEffect, useState } from "react";
import { Check, Moon, Sun, Monitor, Settings, Sparkles, Shield, Cpu } from "lucide-react";
import { getSettings, saveSettings } from "@/lib/storage/store";
import { useTheme } from "@/components/ui/ThemeProvider";
import type { AppSettings, DiagramType, ThemeMode } from "@/lib/storage/types";
import { DEFAULT_SETTINGS, DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";

const SECTIONS = ["Appearance", "Architecture", "Generation", "About System"] as const;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState<(typeof SECTIONS)[number]>("Appearance");

  useEffect(() => {
    const id = requestAnimationFrame(() => setSettings(getSettings()));
    return () => cancelAnimationFrame(id);
  }, []);

  function update(partial: Partial<AppSettings>) {
    const next = { ...settings, ...partial };
    setSettings(next);
    saveSettings(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function setThemeMode(mode: ThemeMode) {
    setTheme(mode);
    update({ theme: mode });
  }

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 backdrop-blur-md">
            <Settings className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-300">
              System Configuration
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Workspace Settings
          </h1>
          <p className="mt-2 text-base text-slate-300">
            Configure theme aesthetics, default diagram specs, auto-save, and AI behaviors.
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
            <Check className="h-3.5 w-3.5" /> Preferences Saved
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#0A0C14] p-1.5">
        {SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              section === s
                ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {section === "Appearance" && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 backdrop-blur-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Theme Aesthetic</h2>
            <p className="text-xs text-slate-400">Select interface appearance and accent lighting.</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { mode: "dark" as ThemeMode, icon: Moon, label: "Dark Midnight" },
              { mode: "light" as ThemeMode, icon: Sun, label: "Light Mode" },
              { mode: "system" as ThemeMode, icon: Monitor, label: "System Sync" },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setThemeMode(mode)}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-xs font-bold transition-all ${
                  theme === mode
                    ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                    : "border-white/10 bg-[#07080F] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <Icon className="h-6 w-6" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {section === "Architecture" && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 backdrop-blur-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Diagram Specification Defaults</h2>
            <p className="text-xs text-slate-400">Choose the default UML diagram type when launching new projects.</p>
          </div>

          <div>
            <label htmlFor="default-diagram" className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-400">
              Default Diagram Type
            </label>
            <select
              id="default-diagram"
              value={settings.defaultDiagramType}
              onChange={(e) => update({ defaultDiagramType: e.target.value as DiagramType })}
              className="w-full rounded-2xl border border-white/10 bg-[#07080F] px-4 py-3 text-xs font-semibold text-white outline-none focus:border-cyan-400/50"
            >
              {Object.entries(DIAGRAM_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {section === "Generation" && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 backdrop-blur-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">AI Synthesis Preferences</h2>
            <p className="text-xs text-slate-400">Control project auto-save and inspector pop-up behavior.</p>
          </div>

          <div className="space-y-5 border-t border-white/[0.08] pt-5">
            <Toggle
              label="Auto-Save Architecture Projects"
              description="Automatically commit changes and generated diagrams to local storage."
              checked={settings.autoSaveProjects}
              onChange={(v) => update({ autoSaveProjects: v })}
            />
            <Toggle
              label="Show Property Inspector by Default"
              description="Open component inspector drawer automatically upon AI synthesis completion."
              checked={settings.showExplanationByDefault}
              onChange={(v) => update({ showExplanationByDefault: v })}
            />
          </div>
        </div>
      )}

      {section === "About System" && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0C14]/90 p-7 backdrop-blur-2xl space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">ArchiGen AI Engine Specifications</h2>
            <p className="text-xs text-slate-400">System architecture components and privacy guarantee.</p>
          </div>

          <dl className="space-y-3 divide-y divide-white/[0.08] text-xs">
            <Row label="Core Product" value="ArchiGen AI Studio Pro v0.1" />
            <Row label="AI Inference Engine" value="Groq / OpenAI API via Vercel AI SDK" />
            <Row label="Storage Engine" value="Encrypted Browser Local Storage" />
            <Row label="Diagram Renderer" value="Mermaid.js v11 SVG Canvas Engine" />
            <Row label="Privacy Mode" value="100% Client-Side Local Project Storage" />
          </dl>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between pt-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-mono font-semibold text-cyan-300">{value}</dd>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-cyan-400" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-slate-950 transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </label>
  );
}
