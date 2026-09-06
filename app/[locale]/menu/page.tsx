import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getMenu } from "@/lib/content/get-menu";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { TastingMenu } from "@/components/menu/tasting-menu";
import { ALaCarteList } from "@/components/menu/a-la-carte-list";
import { WineList } from "@/components/menu/wine-list";
import { AllergenLegend } from "@/components/menu/allergen-legend";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMenuJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata, SITE_URL } from "@/lib/seo/metadata";
import { getPathname } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.menu" });

  return buildMetadata({
    locale,
    pathname: "/menu",
    title: t("title"),
    description: t("description"),
  });
}

export default async function MenuPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Menu");
  const menu = getMenu();
  const typedLocale = locale === "en" ? "en" : "pl";

  const menuJsonLd = buildMenuJsonLd({
    menu,
    locale: typedLocale,
    url: `${SITE_URL}${getPathname({ locale, href: "/menu" })}`,
  });

  return (
    <>
      <JsonLd data={menuJsonLd} />
      <Section>
        <Heading as="h1" size="display">
          {t("pageTitle")}
        </Heading>
        <p className="mt-4 max-w-prose text-lg">{t("pageIntro")}</p>
      </Section>
      <TastingMenu menu={menu} locale={typedLocale} />
      <ALaCarteList menu={menu} locale={typedLocale} />
      <WineList menu={menu} locale={typedLocale} />
      <AllergenLegend menu={menu} locale={typedLocale} />
    </>
  );
}
