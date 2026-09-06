import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getRestaurant } from "@/lib/content/get-restaurant";
import { OpenStatus } from "@/components/open-status/open-status";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

export async function Header() {
  const t = await getTranslations("Nav");
  const restaurant = getRestaurant();

  const links = [
    { href: "/", label: t("home") },
    { href: "/menu", label: t("menu") },
    { href: "/reservation", label: t("reservation") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="border-ink/10 bg-paper/95 sticky top-0 z-40 flex items-center justify-between gap-4 border-b px-6 py-4 backdrop-blur md:px-16">
      <Link href="/" className="font-display text-lg tracking-wide">
        {restaurant.name}
      </Link>

      <nav
        className="hidden items-center gap-8 md:flex"
        aria-label={t("mainNavLabel")}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-amber-ink text-sm tracking-wide uppercase"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-6 md:flex">
        <OpenStatus />
        <LocaleSwitcher />
      </div>

      <MobileNav links={links} />
    </header>
  );
}
