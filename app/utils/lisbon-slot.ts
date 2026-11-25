import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { validAgendaDay } from "./agenda-date";

dayjs.extend(utc);
dayjs.extend(timezone);

export const LISBON_TIME_ZONE = "Europe/Lisbon";

export function parseLisbonSlot(day: string, time: string) {
  if (!validAgendaDay(day) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return null;
  }
  const localValue = `${day} ${time}`;
  const date = dayjs.tz(localValue, LISBON_TIME_ZONE);
  return date.format("YYYY-MM-DD HH:mm") === localValue ? date : null;
}
