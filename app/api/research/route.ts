import { generateObject } from "ai";
import { model } from "@/lib/ai/models";
import { researchSchema } from "@/lib/ai/schema";
import { RESEARCH_PROMPT } from "@/lib/ai/prompt";
import { checkApiKey } from "@/lib/rate-limit";
import { synthesizeFallbackResearch } from "@/lib/ai/fallback-synthesizer";

const MIN_QUESTION_LENGTH = 10;

export async function POST(req: Request) {
  let question = "";

  try {
    const body = await req.json();
    question = typeof body.question === "string" ? body.question.trim() : "";

    if (!question) {
      return Response.json(
        { error: "Please enter an architecture research question." },
        { status: 400 },
      );
    }

    if (question.length < MIN_QUESTION_LENGTH) {
      return Response.json(
        { error: "Please provide a more detailed question." },
        { status: 400 },
      );
    }

    const apiKey = checkApiKey();
    if (!apiKey) {
      const fallback = synthesizeFallbackResearch(question);
      return Response.json(fallback);
    }

    try {
      const { object } = await generateObject({
        model,
        schema: researchSchema,
        system: RESEARCH_PROMPT,
        prompt: question,
      });

      return Response.json(object);
    } catch (aiErr) {
      console.warn("Research AI call failed, using fallback:", aiErr);
      const fallback = synthesizeFallbackResearch(question);
      return Response.json(fallback);
    }
  } catch (error) {
    console.error("Research API error:", error);
    const fallback = synthesizeFallbackResearch(question || "Architecture Research");
    return Response.json(fallback);
  }
}
