import { ImageResponse } from "next/og";
import { getRestaurant } from "@/lib/content/get-restaurant";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export async function renderOpengraphImage(locale: string) {
  const restaurant = getRestaurant();
  const typedLocale = locale === "en" ? "en" : "pl";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#0A0A0A",
        color: "#F4F1EA",
        padding: "80px",
        fontFamily: "serif",
      }}
    >
      <div style={{ fontSize: 72, letterSpacing: -1 }}>{restaurant.name}</div>
      <div style={{ fontSize: 32, marginTop: 24, color: "#B8873F" }}>
        {restaurant.shortTagline[typedLocale]}
      </div>
    </div>,
    OG_IMAGE_SIZE,
  );
}
