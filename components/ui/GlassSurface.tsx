"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";

type GlassVariant = "default" | "sidebar" | "inspector" | "canvas" | "input" | "toolbar" | "card";

const VARIANT: Record<GlassVariant, string> = {
  default: "glass-surface-default",
  sidebar: "glass-surface-sidebar",
  inspector: "glass-surface-inspector",
  canvas: "glass-surface-canvas",
  input: "glass-surface-input",
  toolbar: "glass-surface-toolbar",
  card: "glass-surface-card",
};

type Props = {
  children: ReactNode;
  variant?: GlassVariant;
  className?: string;
  as?: "div" | "aside" | "section" | "header" | "nav";
} & HTMLAttributes<HTMLElement>;

const GlassSurface = forwardRef<HTMLElement, Props>(function GlassSurface(
  { children, variant = "default", className = "", as: Tag = "div", ...rest },
  ref,
) {
  return (
    <Tag ref={ref as never} className={`${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
});

export default GlassSurface;
