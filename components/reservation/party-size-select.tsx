"use client";

import { useTranslations } from "next-intl";

type Props = {
  id: string;
  name: string;
  maxPartySize: number;
  defaultValue?: number;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function PartySizeSelect({
  id,
  name,
  maxPartySize,
  defaultValue = 2,
  ...aria
}: Props) {
  const t = useTranslations("Reservation.form");

  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      required
      className="border-ink/30 bg-paper w-full border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      {...aria}
    >
      {Array.from({ length: maxPartySize }, (_, index) => index + 1).map(
        (size) => (
          <option key={size} value={size}>
            {t("guestsCount", { count: size })}
          </option>
        ),
      )}
    </select>
  );
}
