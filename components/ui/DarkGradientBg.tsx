"use client";

import React from "react";

interface DarkGradientBgProps {
  children: React.ReactNode;
  className?: string;
  patternOpacity?: number;
  glow?: boolean;
}

export function DarkGradientBg({
  children,
  className = "",
  patternOpacity = 0.05,
  glow = true,
}: DarkGradientBgProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[#dddb9d]/15 bg-gradient-to-b from-[#12140a]/90 via-[#0d0f06]/95 to-[#0a0b04] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(123,201,99,0.1)] transition-all duration-300 ${className}`}
    >
      {/* Subtle Dot Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dddb9d_1px,transparent_1px)] [background-size:20px_20px]"
        style={{ opacity: patternOpacity }}
      />

      {/* Atmospheric Ambient Glows */}
      {glow && (
        <>
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#7bc963]/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-[#567f2b]/15 blur-3xl" />
        </>
      )}

      {/* Subtle Top Accent Border Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dddb9d]/30 to-transparent" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default DarkGradientBg;
