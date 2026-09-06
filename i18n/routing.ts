import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  pathnames: {
    "/": "/",
    "/menu": "/menu",
    "/reservation": {
      pl: "/rezerwacja",
      en: "/reservation",
    },
    "/contact": {
      pl: "/kontakt",
      en: "/contact",
    },
  },
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
