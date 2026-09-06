import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://spichlerznr8.pl";
export const SITE_NAME = "Spichlerz Nr 8";

type BuildMetadataOptions = {
  locale: string;
  pathname: AppPathname;
  title: string;
  description: string;
};

export function buildMetadata({
  locale,
  pathname,
  title,
  description,
}: BuildMetadataOptions): Metadata {
  const canonical = `${SITE_URL}${getPathname({ locale, href: pathname })}`;

  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((code) => [
      code,
      `${SITE_URL}${getPathname({ locale: code, href: pathname })}`,
    ]),
  );
  languages["x-default"] = `${SITE_URL}${getPathname({
    locale: routing.defaultLocale,
    href: pathname,
  })}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}
