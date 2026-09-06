"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  computeOpenStatus,
  type OpenStatus as OpenStatusResult,
} from "@/lib/hours/open-status";
import { cn } from "@/lib/utils/cn";
import type { OpeningHours } from "@/types";

const REFRESH_INTERVAL_MS = 60_000;

type Props = {
  hours: OpeningHours;
  initialStatus: OpenStatusResult;
  className?: string;
};

const dotColor: Record<OpenStatusResult["state"], string> = {
  open: "bg-emerald-600",
  "closing-soon": "bg-amber",
  closed: "bg-ink/30",
};

export function OpenStatusClient({ hours, initialStatus, className }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const t = useTranslations("OpenStatus");
  const tWeekday = useTranslations("Weekday");

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(computeOpenStatus(hours, new Date()));
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [hours]);

  const label =
    status.state === "open"
      ? t("open")
      : status.state === "closing-soon"
        ? t("closingIn", { minutes: status.minutesRemaining })
        : t("closedUntil", {
            day: tWeekday(status.nextOpenDay),
            time: status.nextOpenTime,
          });

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-sm", className)}
    >
      <span
        aria-hidden="true"
        className={cn("h-2 w-2 rounded-full", dotColor[status.state])}
      />
      {label}
    </span>
  );
}
