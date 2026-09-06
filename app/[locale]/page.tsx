import { getTranslations, setRequestLocale } from "next-intl/server";
import { getRestaurant } from "@/lib/content/get-restaurant";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { ButtonLink } from "@/components/ui/button";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Common");
  const restaurant = getRestaurant();

  return (
    <Section fullScreen tone="ink">
      <Heading as="h1" size="hero">
        {restaurant.name}
      </Heading>
      <p className="mt-6 max-w-prose text-lg">
        {restaurant.shortTagline[locale as "pl" | "en"]}
      </p>
      <ButtonLink href="/reservation" className="mt-10 self-start">
        {t("bookTable")}
      </ButtonLink>
    </Section>
  );
}
