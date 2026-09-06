import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { AllergenMarks } from "./allergen-marks";
import type { Menu } from "@/types";

type Props = {
  menu: Menu;
  locale: "pl" | "en";
};

export async function ALaCarteList({ menu, locale }: Props) {
  const t = await getTranslations("Menu");

  return (
    <section className="px-6 py-16 md:px-16">
      <h2 className="font-display text-display">{t("aLaCarte.heading")}</h2>

      <div className="mt-8 flex flex-col gap-12">
        {menu.aLaCarte.map((section) => (
          <div key={section.sectionId}>
            <h3 className="font-display text-heading text-amber-ink">
              {section.sectionName[locale]}
            </h3>
            <ul className="divide-ink/10 mt-4 divide-y">
              {section.items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
                >
                  <div>
                    <p className="font-display text-lg">{item.name[locale]}</p>
                    <p className="text-ink/70 mt-1 max-w-prose text-sm">
                      {item.description[locale]}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <p className="font-display text-lg whitespace-nowrap">
                      {item.price} {menu.currency}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.vegetarian && (
                        <Badge>{t("dietary.vegetarian")}</Badge>
                      )}
                      {item.vegan && <Badge>{t("dietary.vegan")}</Badge>}
                      {item.glutenFree && (
                        <Badge>{t("dietary.glutenFree")}</Badge>
                      )}
                      <AllergenMarks
                        allergens={item.allergens}
                        menu={menu}
                        locale={locale}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
