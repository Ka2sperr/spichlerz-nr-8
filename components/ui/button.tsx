import { cn } from "@/lib/utils/cn";
import { Link } from "@/i18n/navigation";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-amber text-ink hover:bg-amber-ink hover:text-paper",
  secondary: "border border-current text-ink hover:bg-ink hover:text-paper",
};

const baseStyles =
  "inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}
