import {
  Brain,
  GitBranch,
  Search,
  Pencil,
  Layers,
  FileText,
  Download,
  History,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Architecture Generation",
    description:
      "Describe your system in plain English and get a structured architecture with components, relationships, and technology choices.",
  },
  {
    icon: Layers,
    title: "Multiple Diagram Types",
    description:
      "Class, sequence, ER, flowchart, component, deployment, state, and system architecture diagrams.",
  },
  {
    icon: GitBranch,
    title: "Diagram Editing",
    description:
      "Refine generated diagrams with natural language instructions or edit the Mermaid source directly.",
  },
  {
    icon: Search,
    title: "Architecture Research",
    description:
      "Ask architecture questions and get structured recommendations, alternatives, and trade-off analysis.",
  },
  {
    icon: FileText,
    title: "Technical Explanations",
    description:
      "Every generation includes overview, data flow, scalability, security, reliability, and improvement suggestions.",
  },
  {
    icon: Pencil,
    title: "Project Management",
    description:
      "Save projects locally, track generation history, and revisit previous architectures anytime.",
  },
  {
    icon: Download,
    title: "Export & Sharing",
    description:
      "Export diagrams as PNG, SVG, Markdown, or PDF. Copy Mermaid source for documentation and wikis.",
  },
  {
    icon: History,
    title: "Architecture History",
    description:
      "Browse past generations with search and filtering. Reopen any result to continue refining.",
  },
];

export default function LandingFeatures() {
  return (
    <section className="border-t border-white/5 px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need to design software architecture
          </h2>
          <p className="mx-auto max-w-2xl text-muted">
            From initial concept to exportable documentation — built for
            developers, architects, and engineering teams.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/8 bg-surface/50 p-5 transition-all duration-200 hover:border-white/12 hover:bg-surface"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <f.icon className="h-4 w-4" aria-hidden />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
