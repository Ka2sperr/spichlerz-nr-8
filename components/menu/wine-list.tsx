import { getTranslations } from "next-intl/server";
import type { Menu } from "@/types";

type Props = {
  menu: Menu;
  locale: "pl" | "en";
};

export async function WineList({ menu, locale }: Props) {
  const t = await getTranslations("Menu.wineList");

  return (
    <section className="bg-ink text-paper px-6 py-16 md:px-16">
      <h2 className="font-display text-display">{t("heading")}</h2>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        {menu.wineList.map((category) => (
          <div key={category.category[locale]}>
            <h3 className="font-display text-heading text-amber">
              {category.category[locale]}
            </h3>
            <ul className="mt-4 flex flex-col gap-4">
              {category.wines.map((wine) => (
                <li key={wine.name} className="text-sm">
                  <p className="font-display text-base">{wine.name}</p>
                  <p className="text-paper/60">
                    {wine.producer} · {wine.region}
                  </p>
                  <p className="text-paper/80 mt-1">
                    {wine.glassPrice !== null && (
                      <>
                        {t("glass")}: {wine.glassPrice} {menu.currency} ·{" "}
                      </>
                    )}
                    {t("bottle")}: {wine.bottlePrice} {menu.currency}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
