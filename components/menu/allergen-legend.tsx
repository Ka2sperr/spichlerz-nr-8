import { getTranslations } from "next-intl/server";
import { getAllergenNumberMap } from "@/lib/menu/allergen-numbers";
import type { Menu } from "@/types";

type Props = {
  menu: Menu;
  locale: "pl" | "en";
};

export async function AllergenLegend({ menu, locale }: Props) {
  const t = await getTranslations("Menu.allergenLegend");
  const numberMap = getAllergenNumberMap(menu);
  const entries = Object.entries(menu.allergenLegend) as Array<
    [
      keyof Menu["allergenLegend"],
      Menu["allergenLegend"][keyof Menu["allergenLegend"]],
    ]
  >;

  return (
    <section className="border-ink/10 border-t px-6 py-16 md:px-16">
      <h2 className="font-display text-heading">{t("heading")}</h2>
      <p className="text-ink/70 mt-2 max-w-prose text-sm">{t("description")}</p>
      <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:grid-cols-3">
        {entries.map(([code, label]) => (
          <li key={code}>
            <span className="text-ink/60 mr-2">{numberMap[code]}.</span>
            {label[locale]}
          </li>
        ))}
      </ul>
    </section>
  );
}
