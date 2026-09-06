import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHours } from "@/lib/content/get-hours";
import { getRestaurant } from "@/lib/content/get-restaurant";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { ReservationForm } from "@/components/reservation/reservation-form";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Metadata.reservation",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ReservationPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Reservation");
  const hours = getHours();
  const restaurant = getRestaurant();

  return (
    <Section>
      <Heading as="h1" size="display">
        {t("pageTitle")}
      </Heading>
      <p className="mt-4 max-w-prose text-lg">
        {t("pageIntro", { hours: restaurant.seating.minAdvanceHours })}
      </p>

      <div className="mt-12 max-w-2xl">
        <ReservationForm
          hours={hours}
          seating={restaurant.seating}
          locale={locale}
        />
      </div>
    </Section>
  );
}
