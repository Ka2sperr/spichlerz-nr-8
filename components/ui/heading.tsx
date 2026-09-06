import { cn } from "@/lib/utils/cn";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type HeadingSize = "hero" | "display" | "heading";

const sizeStyles: Record<HeadingSize, string> = {
  hero: "text-hero font-display",
  display: "text-display font-display",
  heading: "text-heading font-display",
};

type HeadingProps = ComponentPropsWithoutRef<"h1"> & {
  as?: ElementType;
  size?: HeadingSize;
};

export function Heading({
  as: Component = "h2",
  size = "display",
  className,
  ...props
}: HeadingProps) {
  return <Component className={cn(sizeStyles[size], className)} {...props} />;
}
