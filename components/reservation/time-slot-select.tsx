"use client";

import { useTranslations } from "next-intl";

type Props = {
  id: string;
  name: string;
  slots: string[];
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function TimeSlotSelect({ id, name, slots, ...aria }: Props) {
  const t = useTranslations("Reservation.form");

  return (
    <select
      id={id}
      name={name}
      required
      disabled={slots.length === 0}
      defaultValue=""
      className="border-ink/30 bg-paper w-full border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
      {...aria}
    >
      <option value="" disabled>
        {slots.length === 0 ? t("noSlots") : t("selectTime")}
      </option>
      {slots.map((slot) => (
        <option key={slot} value={slot}>
          {slot}
        </option>
      ))}
    </select>
  );
}
