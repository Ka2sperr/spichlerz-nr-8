import type { DaySchedule, OpeningHours, Weekday } from "@/types";

export const WEEKDAYS_BY_JS_INDEX: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function getWeekday(date: Date): Weekday {
  return WEEKDAYS_BY_JS_INDEX[date.getDay()];
}

export function findDaySchedule(
  hours: OpeningHours,
  weekday: Weekday,
): DaySchedule {
  const schedule = hours.regular.find((day) => day.day === weekday);
  if (!schedule) {
    throw new Error(`No schedule configured for "${weekday}" in hours.json`);
  }
  return schedule;
}

export function isSpecialClosure(
  hours: OpeningHours,
  dateKey: string,
): boolean {
  return hours.specialClosures.some((closure) => closure.date === dateKey);
}
