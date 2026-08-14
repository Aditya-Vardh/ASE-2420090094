"use client";

import { useEffect, useState } from "react";
import { Check, Moon, Sun, Monitor, Settings } from "lucide-react";
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
    <div className="mx-auto max-w-4xl p-6 lg:p-10 pt-8 sm:pt-12 pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#dddb9d]/15 pb-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-3.5 py-1 backdrop-blur-md">
            <Settings className="h-3.5 w-3.5 text-[#7bc963]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#7bc963]">
              System Configuration
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#f2f1da] sm:text-5xl leading-tight mb-2">
            Workspace Settings
          </h1>
          <p className="text-base text-[#c8c69d]">
            Configure theme aesthetics, default diagram specs, auto-save, and AI behaviors.
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 rounded-full border border-[#7bc963]/30 bg-[#7bc963]/10 px-3.5 py-1.5 font-mono text-xs font-bold text-[#7bc963] shrink-0">
            <Check className="h-3.5 w-3.5" /> Preferences Saved
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[#dddb9d]/20 bg-[#12140a] p-1.5">
        {SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              section === s
                ? "bg-[#7bc963] text-[#0a0b04] shadow-[0_0_20px_rgba(123,201,99,0.3)]"
                : "text-[#c8c69d] hover:text-[#f2f1da] hover:bg-[#dddb9d]/10"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {section === "Appearance" && (
        <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl space-y-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04]" />
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-[#f2f1da] mb-1">Theme Aesthetic</h2>
            <p className="text-xs text-[#c8c69d]">Select interface appearance and accent lighting.</p>

            <div className="grid grid-cols-3 gap-4 mt-6">
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
                      ? "border-[#7bc963] bg-[#7bc963]/10 text-[#7bc963] shadow-[0_0_25px_rgba(123,201,99,0.2)]"
                      : "border-[#dddb9d]/15 bg-[#070804] text-[#c8c69d] hover:border-[#dddb9d]/30 hover:text-[#f2f1da]"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "Architecture" && (
        <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl space-y-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04]" />
          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#f2f1da] mb-1">Diagram Specification Defaults</h2>
              <p className="text-xs text-[#c8c69d]">Choose the default UML diagram type when launching new projects.</p>
            </div>

            <div>
              <label htmlFor="default-diagram" className="mb-2 block text-xs font-mono uppercase tracking-wider text-[#8e8c6c]">
                Default Diagram Type
              </label>
              <select
                id="default-diagram"
                value={settings.defaultDiagramType}
                onChange={(e) => update({ defaultDiagramType: e.target.value as DiagramType })}
                className="w-full rounded-2xl border border-[#dddb9d]/20 bg-[#070804] px-4 py-3 text-xs font-bold text-[#f2f1da] outline-none focus:border-[#7bc963]"
              >
                {Object.entries(DIAGRAM_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value} className="bg-[#12140a]">{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {section === "Generation" && (
        <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl space-y-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04]" />
          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#f2f1da] mb-1">AI Synthesis Preferences</h2>
              <p className="text-xs text-[#c8c69d]">Control project auto-save and inspector pop-up behavior.</p>
            </div>

            <div className="space-y-5 border-t border-[#dddb9d]/10 pt-5">
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
        </div>
      )}

      {section === "About System" && (
        <div className="relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-7 backdrop-blur-2xl space-y-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04]" />
          <div className="relative z-10 space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#f2f1da]">ArchiGen AI Engine Specifications</h2>
              <p className="text-xs text-[#c8c69d]">System architecture components and privacy guarantee.</p>
            </div>

            <dl className="space-y-3 divide-y divide-[#dddb9d]/10 text-xs">
              <Row label="Core Product" value="ArchiGen AI Studio Pro v0.1" />
              <Row label="AI Inference Engine" value="Groq / OpenAI API via Vercel AI SDK" />
              <Row label="Storage Engine" value="Encrypted Browser Local Storage" />
              <Row label="Diagram Renderer" value="Mermaid.js v11 SVG Canvas Engine" />
              <Row label="Privacy Mode" value="100% Client-Side Local Project Storage" />
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between pt-3">
      <dt className="text-[#8e8c6c] font-medium">{label}</dt>
      <dd className="font-mono font-bold text-[#7bc963]">{value}</dd>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-[#f2f1da]">{label}</p>
        <p className="text-xs text-[#c8c69d]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#7bc963]" : "bg-[#dddb9d]/20"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-[#0a0b04] transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </label>
  );
}
