import type { LocalizedString } from "./restaurant";

export type AllergenCode =
  | "gluten"
  | "crustaceans"
  | "eggs"
  | "fish"
  | "peanuts"
  | "soy"
  | "dairy"
  | "nuts"
  | "celery"
  | "mustard"
  | "sesame"
  | "sulphites"
  | "lupin"
  | "molluscs";

export type DietaryFlags = {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
};

export type TastingCourse = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  allergens: AllergenCode[];
} & DietaryFlags;

export type TastingMenu = {
  name: LocalizedString;
  price: number;
  coursesCount: number;
  winePairingPrice: number;
  courses: TastingCourse[];
};

export type ALaCarteItem = {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  allergens: AllergenCode[];
} & DietaryFlags;

export type ALaCarteSection = {
  sectionId: string;
  sectionName: LocalizedString;
  items: ALaCarteItem[];
};

export type WineListEntry = {
  name: string;
  producer: string;
  region: string;
  glassPrice: number | null;
  bottlePrice: number;
};

export type WineListCategory = {
  category: LocalizedString;
  wines: WineListEntry[];
};

export type Menu = {
  currency: string;
  tastingMenu: TastingMenu;
  aLaCarte: ALaCarteSection[];
  wineList: WineListCategory[];
  allergenLegend: Record<AllergenCode, LocalizedString>;
};
