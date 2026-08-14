"use client";

import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  score?: number;
  tone?: "cyan" | "violet" | "emerald" | "amber" | "rose";
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  cyan: "reflective-cyan",
  violet: "reflective-violet",
  emerald: "reflective-emerald",
  amber: "reflective-amber",
  rose: "reflective-rose",
};

export default function ReflectiveCard({
  children,
  className = "",
  title,
  subtitle,
  score,
  tone = "cyan",
}: Props) {
  return (
    <div className={`reflective-card ${TONE[tone]} ${className}`}>
      <div className="reflective-sheen" aria-hidden />
      {(title || score !== undefined) && (
        <div className="reflective-header">
          <div className="min-w-0">
            {title && <p className="reflective-title">{title}</p>}
            {subtitle && <p className="reflective-subtitle">{subtitle}</p>}
          </div>
          {score !== undefined && (
            <span className="reflective-score">{score}</span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
