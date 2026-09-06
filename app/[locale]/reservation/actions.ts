"use server";

import { getTranslations } from "next-intl/server";
import { getHours } from "@/lib/content/get-hours";
import { getRestaurant } from "@/lib/content/get-restaurant";
import { buildReservationSchema } from "@/lib/validation/reservation-schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getResendClient } from "@/lib/email/resend";
import type {
  ReservationActionState,
  ReservationFieldErrors,
  ReservationFormValues,
} from "@/types";

export async function createReservation(
  locale: string,
  _prevState: ReservationActionState,
  formData: FormData,
): Promise<ReservationActionState> {
  const t = await getTranslations({ locale, namespace: "Reservation.errors" });
  const hours = getHours();
  const restaurant = getRestaurant();

  const raw = {
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    partySize: Number(formData.get("partySize") ?? 0),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    honeypot: String(formData.get("honeypot") ?? ""),
  };

  const schema = buildReservationSchema({ hours, seating: restaurant.seating });
  const result = schema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: ReservationFieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ReservationFormValues;
      const message = t(issue.message);
      fieldErrors[field] = [...(fieldErrors[field] ?? []), message];
    }

    return {
      status: "error",
      message: t("formHasErrors"),
      fieldErrors,
    };
  }

  const { date, time, partySize, name, email, phone, notes } = result.data;

  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("reservations").insert({
      date,
      time,
      party_size: partySize,
      name,
      email,
      phone,
      notes: notes ?? null,
    });

    if (error) {
      console.error("[reservation] Supabase insert failed", error);
    }
  } else {
    console.warn(
      "[reservation] Supabase not configured — skipping database insert",
    );
  }

  const resend = getResendClient();
  const notificationEmail = process.env.RESERVATION_NOTIFICATION_EMAIL;

  if (resend && notificationEmail) {
    try {
      await resend.emails.send({
        from: `${restaurant.name} <${restaurant.contact.email}>`,
        to: email,
        replyTo: notificationEmail,
        subject: t("emailSubject"),
        text: t("emailBody", { name, date, time, partySize }),
      });
    } catch (error) {
      console.error("[reservation] Resend send failed", error);
    }
  } else {
    console.warn(
      "[reservation] Resend not configured — skipping confirmation email",
    );
  }

  return {
    status: "success",
    message: t("success"),
  };
}
