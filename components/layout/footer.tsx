import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getRestaurant } from "@/lib/content/get-restaurant";

export async function Footer() {
  const t = await getTranslations();
  const restaurant = getRestaurant();
  const year = new Date().getFullYear();

  return (
    <footer className="border-paper/10 bg-ink text-paper border-t px-6 py-16 md:px-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg">{restaurant.name}</p>
          <p className="text-paper/70 mt-2 text-sm">
            {restaurant.address.streetAddress}, {restaurant.address.postalCode}{" "}
            {restaurant.address.addressLocality}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href={`tel:${restaurant.contact.phone}`}
            className="hover:text-amber"
          >
            {restaurant.contact.phone}
          </a>
          <a
            href={`mailto:${restaurant.contact.email}`}
            className="hover:text-amber"
          >
            {restaurant.contact.email}
          </a>
        </div>

        <nav
          className="flex flex-col gap-2 text-sm"
          aria-label={t("Nav.mainNavLabel")}
        >
          <Link href="/menu">{t("Nav.menu")}</Link>
          <Link href="/reservation">{t("Nav.reservation")}</Link>
          <Link href="/contact">{t("Nav.contact")}</Link>
        </nav>
      </div>

      <p className="text-paper/50 mt-12 text-xs">
        © {year} {restaurant.legalName} — {t("Footer.rights")}
      </p>
    </footer>
  );
}
