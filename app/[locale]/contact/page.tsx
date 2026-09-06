import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getRestaurant } from "@/lib/content/get-restaurant";
import { getHours } from "@/lib/content/get-hours";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { MapEmbed } from "@/components/contact/map-embed";
import { HoursTable } from "@/components/contact/hours-table";
import { buildMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.contact" });

  return buildMetadata({
    locale,
    pathname: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");
  const restaurant = getRestaurant();
  const hours = getHours();
  const typedLocale = locale === "en" ? "en" : "pl";

  return (
    <Section>
      <Heading as="h1" size="display">
        {t("pageTitle")}
      </Heading>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-10">
          <div>
            <Heading as="h2" size="heading">
              {t("addressHeading")}
            </Heading>
            <p className="mt-2">
              {restaurant.address.streetAddress}
              <br />
              {restaurant.address.postalCode}{" "}
              {restaurant.address.addressLocality}
            </p>
            <a
              href={`tel:${restaurant.contact.phone}`}
              className="hover:text-amber-ink mt-4 block"
            >
              {restaurant.contact.phone}
            </a>
            <a
              href={`mailto:${restaurant.contact.email}`}
              className="hover:text-amber-ink"
            >
              {restaurant.contact.email}
            </a>
          </div>

          <div>
            <Heading as="h2" size="heading">
              {t("hoursHeading")}
            </Heading>
            <div className="mt-2">
              <HoursTable hours={hours} />
            </div>
          </div>

          <div>
            <Heading as="h2" size="heading">
              {t("directionsHeading")}
            </Heading>
            <p className="mt-2 max-w-prose">
              {restaurant.directionsInfo[typedLocale]}
            </p>
          </div>

          <div>
            <Heading as="h2" size="heading">
              {t("parkingHeading")}
            </Heading>
            <p className="mt-2 max-w-prose">
              {restaurant.parkingInfo[typedLocale]}
            </p>
          </div>
        </div>

        <MapEmbed
          latitude={restaurant.geo.latitude}
          longitude={restaurant.geo.longitude}
          label={restaurant.name}
        />
      </div>
    </Section>
  );
}
