import { generateObject } from "ai";
import { model } from "@/lib/ai/models";
import { researchSchema } from "@/lib/ai/schema";
import { RESEARCH_PROMPT } from "@/lib/ai/prompt";
import { checkApiKey, getClientKey, rateLimit } from "@/lib/rate-limit";

const MIN_QUESTION_LENGTH = 10;

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
    const question =
      typeof body.question === "string" ? body.question.trim() : "";

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

    const { object } = await generateObject({
      model,
      schema: researchSchema,
      system: RESEARCH_PROMPT,
      prompt: question,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Research API error:", error);
    return Response.json(
      { error: "Unable to complete research. Please try again." },
      { status: 500 },
    );
  }
}
