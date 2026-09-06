import { cn } from "@/lib/utils/cn";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  as?: ElementType;
  fullScreen?: boolean;
  tone?: "paper" | "ink";
};

export function Section({
  as: Component = "section",
  fullScreen = false,
  tone = "paper",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        "px-6 py-24 md:px-16 lg:px-24",
        fullScreen && "flex min-h-screen flex-col justify-center",
        tone === "ink" ? "bg-ink text-paper" : "bg-paper text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
