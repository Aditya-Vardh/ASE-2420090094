import type { DiagramType } from "@/lib/storage/types";

const DIAGRAM_HEADERS: Record<string, RegExp> = {
  classDiagram: /^classDiagram/i,
  sequenceDiagram: /^sequenceDiagram/i,
  erDiagram: /^erDiagram/i,
  flowchart: /^flowchart/i,
  stateDiagram: /^stateDiagram/i,
  graph: /^graph\s/i,
};

const DEFAULT_HEADER: Record<DiagramType, string> = {
  class: "classDiagram",
  sequence: "sequenceDiagram",
  er: "erDiagram",
  flowchart: "flowchart TB",
  component: "flowchart TB",
  deployment: "flowchart TB",
  state: "stateDiagram-v2",
  architecture: "flowchart TB",
};

export function sanitizeMermaid(code: string): string {
  let cleaned = code.trim();
  cleaned = cleaned.replace(/^```(?:mermaid)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.replace(/[""]/g, '"').replace(/['']/g, "'");
  return cleaned.trim();
}

function hasValidHeader(code: string): boolean {
  return Object.values(DIAGRAM_HEADERS).some((re) => re.test(code));
}

function ensureHeader(code: string, diagramType: DiagramType = "architecture"): string {
  if (hasValidHeader(code)) return code;
  return `${DEFAULT_HEADER[diagramType]}\n${code}`;
}

function quoteFlowchartLabels(line: string): string {
  return line
    .replace(/(\w+)\[([^\]"]+)\]/g, (_, id, label) => {
      if (/[()/:,&-]/.test(label)) {
        const safe = label.replace(/"/g, "'");
        return `${id}["${safe}"]`;
      }
      return `${id}[${label}]`;
    })
    .replace(/(\w+)\(([^)"]+)\)/g, (_, id, label) => {
      if (/[\\/:,&-]/.test(label)) {
        const safe = label.replace(/"/g, "'");
        return `${id}("${safe}")`;
      }
      return `${id}("${label}")`;
    });
}

function removeInvalidLines(code: string): string {
  return code
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      if (t.startsWith("```")) return false;
      if (/^(note|title|link|style|classDef|class)\s/i.test(t) && t.includes("undefined")) return false;
      return true;
    })
    .join("\n");
}

export function repairMermaid(code: string, diagramType: DiagramType = "architecture"): string {
  let repaired = sanitizeMermaid(code);
  repaired = removeInvalidLines(repaired);
  repaired = ensureHeader(repaired, diagramType);

  const lines = repaired.split("\n");
  const processed = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("%%") || trimmed.startsWith("subgraph") || trimmed === "end") {
      return line;
    }
    if (/^(classDiagram|sequenceDiagram|erDiagram|flowchart|stateDiagram|graph|autonumber|actor|participant)\b/i.test(trimmed)) {
      return line;
    }
    return quoteFlowchartLabels(line);
  });

  return processed.join("\n").trim();
}

export async function renderMermaidSafe(
  mermaid: typeof import("mermaid").default,
  code: string,
  diagramType: DiagramType = "architecture",
): Promise<{ svg: string; repaired: string }> {
  const attempts = [
    code,
    repairMermaid(code, diagramType),
    repairMermaid(code, "flowchart"),
    `flowchart TB\n    A["Client Application"] --> B["API Gateway"]\n    B --> C[("Database")]`,
  ];

  let lastError: unknown;

  for (const attempt of attempts) {
    try {
      const id = `archigen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      await mermaid.parse(attempt);
      const { svg } = await mermaid.render(id, attempt);
      return { svg, repaired: attempt };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("Mermaid render failed");
}
