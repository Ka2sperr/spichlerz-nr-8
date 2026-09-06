import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getRestaurant } from "@/lib/content/get-restaurant";
import { getMenu } from "@/lib/content/get-menu";
import { Hero } from "@/components/home/hero";
import { AboutTeaser } from "@/components/home/about-teaser";
import { MenuTeaser } from "@/components/home/menu-teaser";
import { ChefSection } from "@/components/home/chef-section";
import { Gallery } from "@/components/home/gallery";
import { ReservationCta } from "@/components/home/reservation-cta";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.home" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const restaurant = getRestaurant();
  const menu = getMenu();
  const typedLocale = locale as "pl" | "en";

  return (
    <>
      <Hero restaurant={restaurant} locale={typedLocale} />
      <AboutTeaser restaurant={restaurant} locale={typedLocale} />
      <MenuTeaser menu={menu} locale={typedLocale} />
      <ChefSection restaurant={restaurant} locale={typedLocale} />
      <Gallery restaurant={restaurant} locale={typedLocale} />
      <ReservationCta />
    </>
  );
}
