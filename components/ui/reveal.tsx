"use client";

import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type RevealTag = "div" | "li" | "article";

type RevealProps = ComponentPropsWithoutRef<"div"> & {
  as?: RevealTag;
  delay?: number;
};

export function Reveal({
  as = "div",
  delay = 0,
  className,
  style,
  children,
  ...props
}: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const Component = as as ElementType;

  return (
    <Component
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Component>
  );
}
