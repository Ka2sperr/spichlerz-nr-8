import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { Heading } from "@/components/ui/heading";
import type { Menu } from "@/types";

type Props = {
  menu: Menu;
  locale: "pl" | "en";
};

export async function MenuTeaser({ menu, locale }: Props) {
  const t = await getTranslations("Home.menuTeaser");
  const courses = menu.tastingMenu.courses.slice(0, 3);

  return (
    <section className="bg-ink text-paper px-6 py-24 md:px-16 lg:py-32">
      <Reveal>
        <Heading as="h2">{t("heading")}</Heading>
        <p className="text-paper/70 mt-4 max-w-prose">{t("subheading")}</p>
      </Reveal>

      <ul className="mt-12 grid gap-8 md:grid-cols-3">
        {courses.map((course, index) => (
          <Reveal
            key={course.id}
            as="li"
            delay={index * 100}
            className="border-paper/20 border-t pt-6"
          >
            <p className="font-display text-xl">{course.title[locale]}</p>
            <p className="text-paper/70 mt-2 text-sm">
              {course.description[locale]}
            </p>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={300}>
        <Link
          href="/menu"
          className="decoration-amber mt-12 inline-block underline underline-offset-4"
        >
          {t("cta")}
        </Link>
      </Reveal>
    </section>
  );
}
