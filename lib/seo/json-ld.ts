import type { Menu, OpeningHours, Restaurant } from "@/types";

const DAY_TO_SCHEMA: Record<string, string> = {
  monday: "https://schema.org/Monday",
  tuesday: "https://schema.org/Tuesday",
  wednesday: "https://schema.org/Wednesday",
  thursday: "https://schema.org/Thursday",
  friday: "https://schema.org/Friday",
  saturday: "https://schema.org/Saturday",
  sunday: "https://schema.org/Sunday",
};

function buildOpeningHoursSpecification(hours: OpeningHours) {
  return hours.regular
    .filter((day) => !day.closed)
    .map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_TO_SCHEMA[day.day],
      opens: day.open,
      closes: day.close,
    }));
}

export function buildRestaurantJsonLd({
  restaurant,
  hours,
  url,
  locale,
}: {
  restaurant: Restaurant;
  hours: OpeningHours;
  url: string;
  locale: "pl" | "en";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description[locale],
    url,
    telephone: restaurant.contact.phone,
    email: restaurant.contact.email,
    priceRange: restaurant.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.streetAddress,
      addressLocality: restaurant.address.addressLocality,
      postalCode: restaurant.address.postalCode,
      addressCountry: restaurant.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.geo.latitude,
      longitude: restaurant.geo.longitude,
    },
    image: restaurant.gallery[0]?.src,
    servesCuisine: "Baltic",
    openingHoursSpecification: buildOpeningHoursSpecification(hours),
    sameAs: [restaurant.social.instagram, restaurant.social.facebook].filter(
      (value): value is string => Boolean(value),
    ),
  };
}

type DietFlags = { vegetarian: boolean; vegan: boolean; glutenFree: boolean };

function suitableForDiet({ vegetarian, vegan, glutenFree }: DietFlags) {
  const diets = [
    vegetarian && "https://schema.org/VegetarianDiet",
    vegan && "https://schema.org/VeganDiet",
    glutenFree && "https://schema.org/GlutenFreeDiet",
  ].filter((value): value is string => Boolean(value));

  return diets.length > 0 ? diets : undefined;
}

export function buildMenuJsonLd({
  menu,
  locale,
  url,
}: {
  menu: Menu;
  locale: "pl" | "en";
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    url,
    name: menu.tastingMenu.name[locale],
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: menu.tastingMenu.name[locale],
        hasMenuItem: menu.tastingMenu.courses.map((course) => ({
          "@type": "MenuItem",
          name: course.title[locale],
          description: course.description[locale],
          suitableForDiet: suitableForDiet(course),
        })),
      },
      ...menu.aLaCarte.map((section) => ({
        "@type": "MenuSection",
        name: section.sectionName[locale],
        hasMenuItem: section.items.map((item) => ({
          "@type": "MenuItem",
          name: item.name[locale],
          description: item.description[locale],
          offers: {
            "@type": "Offer",
            price: item.price,
            priceCurrency: menu.currency,
          },
          suitableForDiet: suitableForDiet(item),
        })),
      })),
    ],
  };
}
