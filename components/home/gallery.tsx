import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils/cn";
import type { Restaurant } from "@/types";

type Props = {
  restaurant: Restaurant;
  locale: "pl" | "en";
};

export async function Gallery({ restaurant, locale }: Props) {
  const t = await getTranslations("Home.gallery");
  const images = restaurant.gallery.slice(2);

  return (
    <section className="bg-ink text-paper px-6 py-24 md:px-16 lg:py-32">
      <Reveal>
        <Heading as="h2">{t("heading")}</Heading>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((image, index) => (
          <Reveal
            key={image.src}
            delay={index * 80}
            className={cn(
              "relative overflow-hidden",
              index % 3 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt[locale]}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
