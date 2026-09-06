import type { Restaurant } from "@/types";
import restaurantData from "@/content/restaurant.json";

export function getRestaurant(): Restaurant {
  return restaurantData as Restaurant;
}
