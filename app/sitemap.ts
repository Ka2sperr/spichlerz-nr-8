import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo/metadata";

const PATHNAMES: AppPathname[] = ["/", "/menu", "/reservation", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHNAMES.map((pathname) => ({
    url: `${SITE_URL}${getPathname({ locale: routing.defaultLocale, href: pathname })}`,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${SITE_URL}${getPathname({ locale, href: pathname })}`,
        ]),
      ),
    },
  }));
}
