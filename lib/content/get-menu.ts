import type { Menu } from "@/types";
import menuData from "@/content/menu.json";

export function getMenu(): Menu {
  return menuData as Menu;
}
