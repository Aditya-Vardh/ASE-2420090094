"use client";

import { useState } from "react";
import { LayoutTemplate } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { DIAGRAM_TYPE_LABELS } from "@/lib/storage/types";
import ChromaGrid from "@/components/ui/ChromaGrid";
import CardNav from "@/components/ui/CardNav";

const CATEGORY_ACCENTS: Record<string, "cyan" | "violet" | "amber" | "rose" | "emerald" | "blue"> = {
  Web: "cyan",
  Mobile: "violet",
  Backend: "amber",
  Cloud: "blue",
  AI: "rose",
  Database: "emerald",
  Enterprise: "violet",
  Distributed: "cyan",
  SaaS: "blue",
  "Real-time": "cyan",
  Microservices: "violet",
  Data: "amber",
};

export default function TemplatesPage() {
  const categories = ["All", ...new Set(TEMPLATES.map((t) => t.category))];
  const [active, setActive] = useState("All");

  const visible = active === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === active);

  return (
    <div className="page-shell mx-auto max-w-6xl">
      <div className="page-header">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400/80">Library</p>
        <h1>Templates</h1>
        <p>Start from a proven architecture template and customize it for your project.</p>
      </div>

      <CardNav
        className="mb-8"
        activeId={active}
        onChange={setActive}
        items={categories.map((c) => ({ id: c, label: c }))}
      />

      <ChromaGrid
        items={visible.map((template) => ({
          id: template.id,
          title: template.name,
          description: template.description,
          href: `/workspace/generate?template=${template.id}`,
          badge: `${template.category} · ${DIAGRAM_TYPE_LABELS[template.diagramType]}`,
          accent: CATEGORY_ACCENTS[template.category] ?? "cyan",
          visual: (
            <div className="flex h-full items-center justify-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-amber-400/50" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-subtle">Use Template</span>
            </div>
          ),
        }))}
      />
    </div>
  );
}
