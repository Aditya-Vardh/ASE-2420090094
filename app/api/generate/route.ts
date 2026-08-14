import { generateObject } from "ai";
import { model } from "@/lib/ai/models";
import { architectureSchema, diagramTypeSchema } from "@/lib/ai/schema";
import { buildGeneratePrompt, REFINE_PROMPT } from "@/lib/ai/prompt";
import { repairMermaid } from "@/lib/mermaid-repair";
import { checkApiKey } from "@/lib/rate-limit";
import { synthesizeFallbackArchitecture } from "@/lib/ai/fallback-synthesizer";
import type { DiagramType } from "@/lib/storage/types";

const MIN_PROMPT_LENGTH = 15;

export async function POST(req: Request) {
  let diagramType: DiagramType = "architecture";
  let idea = "";

  try {
    const body = await req.json();
    idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const refineInstruction = typeof body.refineInstruction === "string" ? body.refineInstruction.trim() : "";
    const currentArchitecture = body.currentArchitecture;
    const diagramTypeResult = diagramTypeSchema.safeParse(body.diagramType ?? "architecture");
    diagramType = diagramTypeResult.success ? diagramTypeResult.data : "architecture";

    if (refineInstruction && currentArchitecture) {
      const apiKey = checkApiKey();
      if (!apiKey) {
        // Return updated architecture via fallback
        const updated = synthesizeFallbackArchitecture(refineInstruction, diagramType);
        return Response.json(updated);
      }

      try {
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
      } catch (err) {
        console.warn("AI refine call failed, using fallback synthesizer:", err);
        const fallback = synthesizeFallbackArchitecture(refineInstruction, diagramType);
        return Response.json(fallback);
      }
    }

    if (!idea) {
      return Response.json(
        { error: "Please describe your system or architecture idea." },
        { status: 400 },
      );
    }

    if (idea.length < MIN_PROMPT_LENGTH) {
      return Response.json(
        { error: "Please add more detail to your description for better results." },
        { status: 400 },
      );
    }

    const apiKey = checkApiKey();
    if (!apiKey) {
      // Return rich, complete architecture fallback synthesis
      const fallback = synthesizeFallbackArchitecture(idea, diagramType);
      return Response.json(fallback);
    }

    try {
      const { object } = await generateObject({
        model,
        schema: architectureSchema,
        system: buildGeneratePrompt(diagramType),
        prompt: idea,
      });

      object.mermaidCode = repairMermaid(object.mermaidCode, diagramType);
      object.diagramType = diagramType;
      return Response.json(object);
    } catch (aiErr) {
      console.warn("External AI call failed, using fallback synthesizer:", aiErr);
      const fallback = synthesizeFallbackArchitecture(idea, diagramType);
      return Response.json(fallback);
    }
  } catch (error) {
    console.error("Generate API error:", error);
    const fallback = synthesizeFallbackArchitecture(idea || "Software Architecture System", diagramType);
    return Response.json(fallback);
  }
}
