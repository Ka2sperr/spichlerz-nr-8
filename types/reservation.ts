export type ReservationFormValues = {
  date: string;
  time: string;
  partySize: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  honeypot: string;
};

export type ReservationFieldErrors = Partial<
  Record<keyof ReservationFormValues, string[]>
>;

export type ReservationActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ReservationFieldErrors;
};
