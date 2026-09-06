"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import { useTranslations } from "next-intl";
import { createReservation } from "@/app/[locale]/reservation/actions";
import { generateAvailableSlots } from "@/lib/hours/slots";
import { toDateKey } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "./date-picker-field";
import { TimeSlotSelect } from "./time-slot-select";
import { PartySizeSelect } from "./party-size-select";
import { FormStatus } from "./form-status";
import type {
  OpeningHours,
  ReservationActionState,
  SeatingPolicy,
} from "@/types";

type Props = {
  hours: OpeningHours;
  seating: SeatingPolicy;
  locale: string;
};

const initialState: ReservationActionState = { status: "idle" };

export function ReservationForm({ hours, seating, locale }: Props) {
  const t = useTranslations("Reservation.form");
  const formRef = useRef<HTMLFormElement>(null);

  const todayKey = useMemo(
    () => toDateKey(toZonedTime(new Date(), hours.timezone)),
    [hours.timezone],
  );
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const slots = useMemo(
    () =>
      generateAvailableSlots(hours, selectedDate, {
        minAdvanceHours: seating.minAdvanceHours,
      }),
    [hours, selectedDate, seating.minAdvanceHours],
  );

  const [state, formAction, isPending] = useActionState(
    createReservation.bind(null, locale),
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setSelectedDate(todayKey);
    }
  }, [state.status, todayKey]);

  const errorId = (field: string) =>
    state.fieldErrors?.[field as keyof typeof state.fieldErrors]
      ? `${field}-error`
      : undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-6"
      noValidate
    >
      <FormStatus state={state} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="text-sm font-medium">
            {t("dateLabel")}
          </label>
          <DatePickerField
            id="date"
            name="date"
            min={todayKey}
            defaultValue={selectedDate}
            onChange={setSelectedDate}
            aria-invalid={Boolean(state.fieldErrors?.date)}
            aria-describedby={errorId("date")}
          />
          {state.fieldErrors?.date && (
            <p id="date-error" className="text-sm text-red-700">
              {state.fieldErrors.date.join(" ")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="time" className="text-sm font-medium">
            {t("timeLabel")}
          </label>
          <TimeSlotSelect
            id="time"
            name="time"
            slots={slots}
            aria-invalid={Boolean(state.fieldErrors?.time)}
            aria-describedby={errorId("time")}
          />
          {state.fieldErrors?.time && (
            <p id="time-error" className="text-sm text-red-700">
              {state.fieldErrors.time.join(" ")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="partySize" className="text-sm font-medium">
            {t("partySizeLabel")}
          </label>
          <PartySizeSelect
            id="partySize"
            name="partySize"
            maxPartySize={seating.maxPartySize}
            aria-invalid={Boolean(state.fieldErrors?.partySize)}
            aria-describedby={errorId("partySize")}
          />
          {state.fieldErrors?.partySize && (
            <p id="partySize-error" className="text-sm text-red-700">
              {state.fieldErrors.partySize.join(" ")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            {t("phoneLabel")}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            autoComplete="tel"
            className="border-ink/30 bg-paper w-full border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-invalid={Boolean(state.fieldErrors?.phone)}
            aria-describedby={errorId("phone")}
          />
          {state.fieldErrors?.phone && (
            <p id="phone-error" className="text-sm text-red-700">
              {state.fieldErrors.phone.join(" ")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            {t("nameLabel")}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="name"
            className="border-ink/30 bg-paper w-full border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-invalid={Boolean(state.fieldErrors?.name)}
            aria-describedby={errorId("name")}
          />
          {state.fieldErrors?.name && (
            <p id="name-error" className="text-sm text-red-700">
              {state.fieldErrors.name.join(" ")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            className="border-ink/30 bg-paper w-full border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={errorId("email")}
          />
          {state.fieldErrors?.email && (
            <p id="email-error" className="text-sm text-red-700">
              {state.fieldErrors.email.join(" ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="text-sm font-medium">
          {t("notesLabel")}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={500}
          className="border-ink/30 bg-paper w-full border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-describedby={errorId("notes")}
        />
        {state.fieldErrors?.notes && (
          <p id="notes-error" className="text-sm text-red-700">
            {state.fieldErrors.notes.join(" ")}
          </p>
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute top-auto left-[-9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
