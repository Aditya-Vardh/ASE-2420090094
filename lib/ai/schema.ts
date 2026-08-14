import { z } from "zod";

export const diagramTypeSchema = z.enum([
  "class",
  "sequence",
  "er",
  "flowchart",
  "component",
  "deployment",
  "state",
  "architecture",
]);

export const explanationSchema = z.object({
  overview: z.string(),
  components: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    }),
  ),
  dataFlow: z.string(),
  technologyChoices: z.string(),
  scalability: z.string(),
  security: z.string(),
  reliability: z.string(),
  tradeoffs: z.string(),
  improvements: z.string(),
});

export const adaptiveInsightsSchema = z.object({
  health: z.number().min(0).max(100),
  healthLabel: z.string(),
  scalability: z.number().min(0).max(100),
  maintainability: z.number().min(0).max(100),
  reliability: z.number().min(0).max(100),
  security: z.number().min(0).max(100),
  adaptability: z.number().min(0).max(100),
  potentialIssues: z.array(z.string()),
  suggestions: z.array(
    z.object({
      current: z.string(),
      suggested: z.string(),
      reason: z.string(),
      category: z.enum([
        "scalability",
        "maintainability",
        "reliability",
        "security",
        "adaptability",
      ]),
    }),
  ),
});

export const architectureSchema = z.object({
  title: z.string(),
  diagramType: diagramTypeSchema,
  mermaidCode: z.string(),
  explanation: explanationSchema,
  technologies: z.array(z.string()),
  adaptiveInsights: adaptiveInsightsSchema.optional(),
});

export const researchSchema = z.object({
  question: z.string(),
  answer: z.string(),
  recommendations: z.array(z.string()),
  alternatives: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      pros: z.array(z.string()),
      cons: z.array(z.string()),
    }),
  ),
  tradeoffs: z.string(),
  architectureImplications: z.string(),
  relevantTechnologies: z.array(z.string()),
  risks: z.array(z.string()),
});

export const umlSchema = z.object({
  title: z.string(),
  classes: z.array(
    z.object({
      name: z.string(),
      attributes: z.array(z.string()),
      methods: z.array(z.string()),
    }),
  ),
  relationships: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      type: z.enum([
        "association",
        "inheritance",
        "aggregation",
        "composition",
      ]),
    }),
  ),
});

export type Architecture = z.infer<typeof architectureSchema>;
export type Research = z.infer<typeof researchSchema>;
export type UML = z.infer<typeof umlSchema>;
