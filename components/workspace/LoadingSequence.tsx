"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Analyzing requirements",
  "Understanding architecture",
  "Designing components",
  "Connecting services",
  "Generating diagram",
  "Preparing insights",
];

type Props = { active: boolean };

export default function LoadingSequence({ active }: Props) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1)), 1800);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="loading-sequence" role="status" aria-live="polite" key={active ? "loading" : "idle"}>
      <div className="mb-3 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" aria-hidden />
        <p className="text-sm font-medium">{STEPS[stepIndex]}…</p>
      </div>
      <div className="loading-steps">
        {STEPS.map((label, i) => (
          <div key={label} className={`loading-step ${i <= stepIndex ? "loading-step-active" : ""}`}>
            <span className="loading-step-dot" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
