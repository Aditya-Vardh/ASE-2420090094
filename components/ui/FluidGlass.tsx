"use client";

import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "aside" | "nav" | "header";
};

/** Floating fluid-glass shell for toolbars and overlays. */
export default function FluidGlass({ children, className = "", as: Tag = "div" }: Props) {
  return <Tag className={`fluid-glass ${className}`}>{children}</Tag>;
}
