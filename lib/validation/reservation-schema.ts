import { z } from "zod";
import { generateAvailableSlots } from "@/lib/hours/slots";
import type { OpeningHours, SeatingPolicy } from "@/types";

type SchemaOptions = {
  hours: OpeningHours;
  seating: SeatingPolicy;
  now?: Date;
};

/**
 * Field "message" values are translation keys, not display text — the
 * caller (the reservation Server Action) translates them via next-intl
 * before returning them to the client, so validation stays locale-agnostic.
 */
export function buildReservationSchema({
  hours,
  seating,
  now = new Date(),
}: SchemaOptions) {
  return z
    .object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalidDate"),
      time: z.string().regex(/^\d{2}:\d{2}$/, "invalidTime"),
      partySize: z
        .number()
        .int()
        .min(1, "partySizeMin")
        .max(seating.maxPartySize, "partySizeMax"),
      name: z.string().trim().min(1, "nameRequired"),
      email: z.string().trim().email("emailInvalid"),
      phone: z.string().trim().min(6, "phoneInvalid"),
      notes: z.string().trim().max(500, "notesTooLong").optional(),
      honeypot: z.string().max(0, "spamDetected"),
    })
    .refine(
      (data) =>
        generateAvailableSlots(hours, data.date, {
          minAdvanceHours: seating.minAdvanceHours,
          now,
        }).includes(data.time),
      { message: "slotUnavailable", path: ["time"] },
    );
}
