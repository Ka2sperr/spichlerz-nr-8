export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ClosedDay = {
  day: Weekday;
  closed: true;
};

export type OpenDay = {
  day: Weekday;
  closed?: false;
  open: string;
  close: string;
};

export type DaySchedule = ClosedDay | OpenDay;

export type SpecialClosure = {
  date: string;
  reason: string;
};

export type OpeningHours = {
  timezone: string;
  regular: DaySchedule[];
  lastSeatingOffsetMinutes: number;
  slotIntervalMinutes: number;
  specialClosures: SpecialClosure[];
};
