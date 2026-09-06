import { getTranslations } from "next-intl/server";
import { OpenStatus } from "@/components/open-status/open-status";
import { Heading } from "@/components/ui/heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export async function ReservationCta() {
  const t = await getTranslations("Home.reservationCta");

  return (
    <section className="bg-paper flex min-h-[70vh] flex-col items-start justify-center gap-8 px-6 py-24 md:px-16">
      <Reveal>
        <Heading as="h2" size="display">
          {t("heading")}
        </Heading>
        <p className="mt-4 max-w-prose text-lg">{t("body")}</p>
      </Reveal>
      <Reveal delay={150} className="flex flex-wrap items-center gap-6">
        <ButtonLink href="/reservation">{t("cta")}</ButtonLink>
        <OpenStatus />
      </Reveal>
    </section>
  );
}
