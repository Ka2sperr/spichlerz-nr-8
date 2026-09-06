import { getAllergenNumberMap } from "@/lib/menu/allergen-numbers";
import type { AllergenCode, Menu } from "@/types";

type Props = {
  allergens: AllergenCode[];
  menu: Menu;
  locale: "pl" | "en";
};

export function AllergenMarks({ allergens, menu, locale }: Props) {
  if (allergens.length === 0) return null;

  const numberMap = getAllergenNumberMap(menu);
  const numbers = allergens
    .map((code) => numberMap[code])
    .sort((a, b) => a - b);
  const fullNames = allergens.map((code) => menu.allergenLegend[code][locale]);

  return (
    <span className="text-ink/60 text-xs">
      <span aria-hidden="true">({numbers.join(", ")})</span>
      <span className="sr-only"> {fullNames.join(", ")}</span>
    </span>
  );
}
