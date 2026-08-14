import type { ArchitectureExplanation, ArchitectureResult, AdaptiveInsights, AdaptiveSuggestion } from "@/lib/storage/types";

/** Derive adaptive insights from explanation text when AI payload omits them (backward compatible). */
export function deriveAdaptiveInsights(result: ArchitectureResult): AdaptiveInsights {
  if (result.adaptiveInsights) return result.adaptiveInsights;

  const e = result.explanation;
  const score = (text: string, boost = 0) => {
    const len = (text ?? "").length;
    const base = Math.min(95, Math.max(55, 60 + Math.floor(len / 40) + boost));
    return base;
  };

  const scalability = score(e.scalability, 5);
  const maintainability = score(e.improvements, 0);
  const reliability = score(e.reliability, 8);
  const security = score(e.security, 3);
  const adaptability = score(e.tradeoffs, 2);
  const health = Math.round(
    (scalability + maintainability + reliability + security + adaptability) / 5,
  );

  const suggestions: AdaptiveSuggestion[] = [];
  if (scalability < 80) {
    suggestions.push({
      current: "Current scaling approach",
      suggested: "Add caching / horizontal scaling",
      reason: e.scalability.slice(0, 160) || "Improve scalability for growth.",
      category: "scalability",
    });
  }
  if (security < 80) {
    suggestions.push({
      current: "Current security posture",
      suggested: "Strengthen auth and defense-in-depth",
      reason: e.security.slice(0, 160) || "Harden authentication and secrets handling.",
      category: "security",
    });
  }
  if (e.improvements) {
    suggestions.push({
      current: "Current design",
      suggested: "Apply AI improvement",
      reason: e.improvements.slice(0, 180),
      category: "maintainability",
    });
  }

  const issues: string[] = [];
  if (scalability < 75) issues.push("Scalability may become a bottleneck under load.");
  if (security < 75) issues.push("Security controls may need strengthening.");
  if (reliability < 75) issues.push("Reliability patterns (retries, failover) may be incomplete.");

  return {
    health,
    healthLabel: health >= 85 ? "Excellent" : health >= 70 ? "Good" : health >= 55 ? "Fair" : "Needs work",
    scalability,
    maintainability,
    reliability,
    security,
    adaptability,
    potentialIssues: issues,
    suggestions: suggestions.slice(0, 4),
  };
}

export function healthTone(score: number): "excellent" | "good" | "fair" | "poor" {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "fair";
  return "poor";
}
