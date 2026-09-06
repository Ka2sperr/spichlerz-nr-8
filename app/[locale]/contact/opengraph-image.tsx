import { renderOpengraphImage, OG_IMAGE_SIZE } from "@/lib/seo/opengraph-image";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = "Spichlerz Nr 8 — fine dining restaurant";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return renderOpengraphImage(locale);
}
