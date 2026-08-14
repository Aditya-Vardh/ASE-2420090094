"use client";

import { type ReactNode } from "react";

type Props = {
  children: ReactNode[];
  className?: string;
};

/** Layered stack preview for architecture cards. */
export default function Stack({ children, className = "" }: Props) {
  return (
    <div className={`stack-preview ${className}`}>
      {children.map((child, i) => (
        <div
          key={i}
          className="stack-layer"
          style={{
            transform: `translateY(${i * -6}px) scale(${1 - i * 0.04})`,
            zIndex: children.length - i,
            opacity: 1 - i * 0.15,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
