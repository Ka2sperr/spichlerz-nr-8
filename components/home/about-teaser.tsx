import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { Heading } from "@/components/ui/heading";
import type { Restaurant } from "@/types";

type Props = {
  restaurant: Restaurant;
  locale: "pl" | "en";
};

export async function AboutTeaser({ restaurant, locale }: Props) {
  const t = await getTranslations("Home.about");
  const image = restaurant.gallery[1];

  return (
    <section className="bg-paper grid gap-12 px-6 py-24 md:grid-cols-[3fr_2fr] md:px-16 lg:py-32">
      <Reveal>
        <Heading as="h2">{t("heading")}</Heading>
        <p className="mt-6 max-w-prose text-lg leading-relaxed">
          {restaurant.description[locale]}
        </p>
      </Reveal>

      <Reveal
        delay={150}
        className="relative aspect-[4/5] w-full overflow-hidden"
      >
        <Image
          src={image.src}
          alt={image.alt[locale]}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover"
        />
      </Reveal>
    </section>
  );
}
