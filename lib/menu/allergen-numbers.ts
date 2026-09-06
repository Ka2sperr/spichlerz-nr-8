import type { AllergenCode, Menu } from "@/types";

export function getAllergenNumberMap(menu: Menu): Record<AllergenCode, number> {
  const codes = Object.keys(menu.allergenLegend) as AllergenCode[];
  return Object.fromEntries(
    codes.map((code, index) => [code, index + 1]),
  ) as Record<AllergenCode, number>;
}
