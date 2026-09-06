import { cn } from "@/lib/utils/cn";
import type { ComponentPropsWithoutRef } from "react";

type BadgeProps = ComponentPropsWithoutRef<"span">;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "border-ink/30 text-ink/70 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs tracking-wide uppercase",
        className,
      )}
      {...props}
    />
  );
}
