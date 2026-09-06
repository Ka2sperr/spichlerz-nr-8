import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { getRestaurant } from "@/lib/content/get-restaurant";
import { getHours } from "@/lib/content/get-hours";
import { buildRestaurantJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/metadata";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Spichlerz Nr 8",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const restaurant = getRestaurant();
  const hours = getHours();
  const restaurantJsonLd = buildRestaurantJsonLd({
    restaurant,
    hours,
    url: `${SITE_URL}${getPathname({ locale, href: "/" })}`,
    locale: locale === "en" ? "en" : "pl",
  });

  return (
    <html lang={locale}>
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        <JsonLd data={restaurantJsonLd} />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
