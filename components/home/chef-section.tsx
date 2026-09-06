import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { Heading } from "@/components/ui/heading";
import type { Restaurant } from "@/types";

type Props = {
  restaurant: Restaurant;
  locale: "pl" | "en";
};

export async function ChefSection({ restaurant, locale }: Props) {
  const t = await getTranslations("Home.chef");
  const { chef } = restaurant;

  return (
    <section className="bg-paper grid gap-12 px-6 py-24 md:grid-cols-[2fr_3fr] md:px-16 lg:py-32">
      <Reveal className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={chef.photo.src}
          alt={chef.photo.alt[locale]}
          fill
          sizes="(min-width: 768px) 35vw, 100vw"
          className="object-cover"
        />
      </Reveal>

      <Reveal delay={150} className="flex flex-col justify-center">
        <p className="text-amber-ink text-sm tracking-wide uppercase">
          {t("eyebrow")}
        </p>
        <Heading as="h2" className="mt-2">
          {chef.name}
        </Heading>
        <p className="mt-6 max-w-prose text-lg leading-relaxed">
          {chef.bio[locale]}
        </p>
      </Reveal>
    </section>
  );
}
