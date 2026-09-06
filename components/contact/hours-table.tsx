import { getTranslations } from "next-intl/server";
import type { OpeningHours, Weekday } from "@/types";

type Props = {
  hours: OpeningHours;
};

const ORDER: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export async function HoursTable({ hours }: Props) {
  const t = await getTranslations("Contact.hoursTable");
  const tDay = await getTranslations("WeekdayLabel");

  return (
    <table className="w-full text-left text-sm">
      <caption className="sr-only">{t("caption")}</caption>
      <tbody className="divide-ink/10 divide-y">
        {ORDER.map((day) => {
          const schedule = hours.regular.find((entry) => entry.day === day);
          if (!schedule) return null;

          return (
            <tr key={day}>
              <th scope="row" className="text-ink/70 py-2 pr-4 font-normal">
                {tDay(day)}
              </th>
              <td className="py-2">
                {schedule.closed
                  ? t("closed")
                  : `${schedule.open}–${schedule.close}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
