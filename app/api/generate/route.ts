import { generateObject } from "ai";
import { model } from "@/lib/ai/models";
import { architectureSchema, diagramTypeSchema } from "@/lib/ai/schema";
import { buildGeneratePrompt, REFINE_PROMPT } from "@/lib/ai/prompt";
import { repairMermaid } from "@/lib/mermaid-repair";
import {
  checkApiKey,
  getClientKey,
  rateLimit,
} from "@/lib/rate-limit";

const MIN_PROMPT_LENGTH = 15;

export async function POST(req: Request) {
  try {
    const apiKey = checkApiKey();
    if (!apiKey) {
      return Response.json(
        {
          error:
            "Your AI service configuration is missing. Set GROQ_API_KEY in your environment.",
        },
        { status: 503 },
      );
    }

    const clientKey = getClientKey(req);
    const limit = rateLimit(clientKey);
    if (!limit.allowed) {
      return Response.json(
        {
          error: `Rate limit exceeded. Try again in ${limit.retryAfter} seconds.`,
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const refineInstruction =
      typeof body.refineInstruction === "string"
        ? body.refineInstruction.trim()
        : "";
    const currentArchitecture = body.currentArchitecture;
    const diagramTypeResult = diagramTypeSchema.safeParse(
      body.diagramType ?? "architecture",
    );
    const diagramType = diagramTypeResult.success
      ? diagramTypeResult.data
      : "architecture";

    if (refineInstruction) {
      if (!currentArchitecture) {
        return Response.json(
          { error: "Current architecture is required for refinement." },
          { status: 400 },
        );
      }

      const { object } = await generateObject({
        model,
        schema: architectureSchema,
        system: REFINE_PROMPT,
        prompt: `Current architecture:\n${JSON.stringify(currentArchitecture, null, 2)}\n\nRefinement instruction:\n${refineInstruction}`,
      });

      object.mermaidCode = repairMermaid(
        object.mermaidCode,
        object.diagramType ?? currentArchitecture?.diagramType ?? diagramType,
      );
      return Response.json(object);
    }

    if (!idea) {
      return Response.json(
        { error: "Please describe your system or architecture idea." },
        { status: 400 },
      );
    }

    if (idea.length < MIN_PROMPT_LENGTH) {
      return Response.json(
        {
          error:
            "Please add more detail to your description for better results.",
        },
        { status: 400 },
      );
    }

    const { object } = await generateObject({
      model,
      schema: architectureSchema,
      system: buildGeneratePrompt(diagramType),
      prompt: idea,
    });

    object.mermaidCode = repairMermaid(object.mermaidCode, diagramType);
    object.diagramType = diagramType;

    return Response.json(object);
  } catch (error) {
    console.error("Generate API error:", error);

    const message =
      error instanceof Error && error.message.includes("timeout")
        ? "The request timed out. Please try again with a shorter description."
        : "Unable to generate architecture. Please try again.";

    return Response.json({ error: message }, { status: 500 });
  }
}
