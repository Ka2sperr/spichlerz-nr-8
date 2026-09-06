import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { AllergenMarks } from "./allergen-marks";
import type { Menu } from "@/types";

type Props = {
  menu: Menu;
  locale: "pl" | "en";
};

export async function TastingMenu({ menu, locale }: Props) {
  const t = await getTranslations("Menu");
  const { tastingMenu } = menu;

  return (
    <section className="px-6 py-16 md:px-16">
      <div className="border-ink/10 flex flex-wrap items-baseline justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="font-display text-display">
            {tastingMenu.name[locale]}
          </h2>
          <p className="text-ink/60 mt-1 text-sm">
            {t("tasting.subtitle", { count: tastingMenu.coursesCount })}
          </p>
        </div>
        <div className="text-right text-sm">
          <p>
            {t("tasting.priceLabel")}: {tastingMenu.price} {menu.currency}
          </p>
          <p className="text-ink/60">
            {t("tasting.winePairingLabel")}: {tastingMenu.winePairingPrice}{" "}
            {menu.currency}
          </p>
        </div>
      </div>

      <ol className="divide-ink/10 mt-8 divide-y">
        {tastingMenu.courses.map((course, index) => (
          <li
            key={course.id}
            className="flex flex-col gap-2 py-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
          >
            <div>
              <p className="font-display text-lg">
                <span className="text-ink/40 mr-3">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {course.title[locale]}
              </p>
              <p className="text-ink/70 mt-1 max-w-prose text-sm">
                {course.description[locale]}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {course.vegetarian && <Badge>{t("dietary.vegetarian")}</Badge>}
              {course.vegan && <Badge>{t("dietary.vegan")}</Badge>}
              {course.glutenFree && <Badge>{t("dietary.glutenFree")}</Badge>}
              <AllergenMarks
                allergens={course.allergens}
                menu={menu}
                locale={locale}
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
