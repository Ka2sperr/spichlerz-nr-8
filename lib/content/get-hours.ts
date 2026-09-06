import type { OpeningHours } from "@/types";
import hoursData from "@/content/hours.json";

export function getHours(): OpeningHours {
  return hoursData as OpeningHours;
}
