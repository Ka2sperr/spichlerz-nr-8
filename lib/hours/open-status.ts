import { toZonedTime } from "date-fns-tz";
import type { DaySchedule, OpeningHours, Weekday } from "@/types";
import { toDateKey, timeToMinutes } from "@/lib/utils/date";

const WEEKDAYS_BY_JS_INDEX: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const CLOSING_SOON_THRESHOLD_MINUTES = 60;
const MAX_LOOKAHEAD_DAYS = 14;

export type OpenStatus =
  | { state: "open" }
  | { state: "closing-soon"; minutesRemaining: number }
  | { state: "closed"; nextOpenDay: Weekday; nextOpenTime: string };

function isSpecialClosure(hours: OpeningHours, dateKey: string): boolean {
  return hours.specialClosures.some((closure) => closure.date === dateKey);
}

function findSchedule(hours: OpeningHours, weekday: Weekday): DaySchedule {
  const schedule = hours.regular.find((day) => day.day === weekday);
  if (!schedule) {
    throw new Error(`No schedule configured for "${weekday}" in hours.json`);
  }
  return schedule;
}

function findNextOpening(
  hours: OpeningHours,
  fromZonedDate: Date,
): { day: Weekday; time: string } {
  for (let offset = 1; offset <= MAX_LOOKAHEAD_DAYS; offset += 1) {
    const candidate = new Date(fromZonedDate);
    candidate.setDate(candidate.getDate() + offset);

    const weekday = WEEKDAYS_BY_JS_INDEX[candidate.getDay()];
    const schedule = findSchedule(hours, weekday);

    if (!schedule.closed && !isSpecialClosure(hours, toDateKey(candidate))) {
      return { day: weekday, time: schedule.open };
    }
  }

  throw new Error(
    "No upcoming opening day found within the lookahead window — check hours.json",
  );
}

export function computeOpenStatus(hours: OpeningHours, now: Date): OpenStatus {
  const zonedNow = toZonedTime(now, hours.timezone);
  const weekday = WEEKDAYS_BY_JS_INDEX[zonedNow.getDay()];
  const todaySchedule = findSchedule(hours, weekday);
  const isClosedToday =
    todaySchedule.closed || isSpecialClosure(hours, toDateKey(zonedNow));

  if (!isClosedToday && !todaySchedule.closed) {
    const minutesNow = zonedNow.getHours() * 60 + zonedNow.getMinutes();
    const openMinutes = timeToMinutes(todaySchedule.open);
    const closeMinutes = timeToMinutes(todaySchedule.close);

    if (minutesNow < openMinutes) {
      return {
        state: "closed",
        nextOpenDay: weekday,
        nextOpenTime: todaySchedule.open,
      };
    }

    if (minutesNow < closeMinutes) {
      const minutesRemaining = closeMinutes - minutesNow;
      if (minutesRemaining <= CLOSING_SOON_THRESHOLD_MINUTES) {
        return { state: "closing-soon", minutesRemaining };
      }
      return { state: "open" };
    }
  }

  const nextOpening = findNextOpening(hours, zonedNow);
  return {
    state: "closed",
    nextOpenDay: nextOpening.day,
    nextOpenTime: nextOpening.time,
  };
}
