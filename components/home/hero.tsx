"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParallax } from "@/hooks/use-parallax";
import { ButtonLink } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import type { Restaurant } from "@/types";

type Props = {
  restaurant: Restaurant;
  locale: "pl" | "en";
};

export function Hero({ restaurant, locale }: Props) {
  const { ref, offset } = useParallax<HTMLDivElement>(0.15);
  const t = useTranslations("Common");
  const heroImage = restaurant.gallery[0];

  return (
    <section className="bg-ink text-paper relative flex min-h-screen items-end overflow-hidden">
      <div
        ref={ref}
        className="absolute inset-0 -z-10"
        style={{ transform: `translateY(${offset}px) scale(1.15)` }}
      >
        <Image
          src={heroImage.src}
          alt={heroImage.alt[locale]}
          fill
          priority
          fetchPriority="high"
          quality={60}
          sizes="100vw"
          className="object-cover opacity-70"
        />
      </div>

      <div className="max-w-3xl px-6 pb-24 md:px-16">
        <Heading as="h1" size="hero">
          {restaurant.name}
        </Heading>
        <p className="text-paper/90 mt-6 max-w-prose text-lg">
          {restaurant.shortTagline[locale]}
        </p>
        <ButtonLink href="/reservation" className="mt-10 inline-flex">
          {t("bookTable")}
        </ButtonLink>
      </div>
    </section>
  );
}
