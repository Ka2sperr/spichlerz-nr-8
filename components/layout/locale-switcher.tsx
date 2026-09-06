"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

const LOCALE_LABELS: Record<string, string> = {
  pl: "PL",
  en: "EN",
};

type Props = {
  tone?: "light" | "dark";
};

export function LocaleSwitcher({ tone = "light" }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Nav");

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="flex items-center gap-2 text-sm tracking-wide uppercase"
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          aria-current={code === locale ? "true" : undefined}
          disabled={code === locale}
          onClick={() => router.replace(pathname, { locale: code })}
          className={cn(
            "disabled:cursor-default",
            code === locale
              ? tone === "dark"
                ? "text-amber font-semibold"
                : "text-amber-ink font-semibold"
              : "opacity-70",
          )}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
