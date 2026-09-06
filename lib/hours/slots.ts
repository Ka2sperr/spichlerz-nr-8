import { fromZonedTime } from "date-fns-tz";
import type { OpeningHours } from "@/types";
import {
  findDaySchedule,
  getWeekday,
  isSpecialClosure,
  minutesToTime,
  parseDateKey,
  timeToMinutes,
} from "@/lib/utils/date";

type Options = {
  minAdvanceHours: number;
  now?: Date;
};

/**
 * dateKey must be a plain "YYYY-MM-DD" calendar date (as produced by
 * <input type="date">), not a timezone-shifted instant — the slot times
 * themselves are resolved against hours.timezone via fromZonedTime.
 */
export function generateAvailableSlots(
  hours: OpeningHours,
  dateKey: string,
  { minAdvanceHours, now = new Date() }: Options,
): string[] {
  const schedule = findDaySchedule(hours, getWeekday(parseDateKey(dateKey)));

  if (schedule.closed || isSpecialClosure(hours, dateKey)) {
    return [];
  }

  const openMinutes = timeToMinutes(schedule.open);
  const closeMinutes = timeToMinutes(schedule.close);
  const lastSlotMinutes = closeMinutes - hours.lastSeatingOffsetMinutes;
  const earliestInstant = new Date(
    now.getTime() + minAdvanceHours * 60 * 60 * 1000,
  );

  const slots: string[] = [];
  for (
    let minutes = openMinutes;
    minutes <= lastSlotMinutes;
    minutes += hours.slotIntervalMinutes
  ) {
    const time = minutesToTime(minutes);
    const slotInstant = fromZonedTime(`${dateKey}T${time}:00`, hours.timezone);

    if (slotInstant.getTime() >= earliestInstant.getTime()) {
      slots.push(time);
    }
  }

  return slots;
}
