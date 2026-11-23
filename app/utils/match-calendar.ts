import type { FullMatch } from "@/app/models/match";
import { AppRoutes } from "@/app/utils/routes";
import { slotEndTime } from "./match-time-range";

type CalendarMatch = Pick<FullMatch, "id" | "pitch" | "starts_at" | "duration_in_minutes">;

function calendarDate(date: Date): string {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
}

function calendarText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r\n|\n|\r/g, "\\n").replace(/[;,]/g, "\\$&");
}

function foldCalendarLine(line: string): string {
  const encoder = new TextEncoder();
  let folded = "";
  let bytes = 0;
  for (const character of line) {
    const width = encoder.encode(character).length;
    if (bytes + width > 75) {
      folded += "\r\n ";
      bytes = 1;
    }
    folded += character;
    bytes += width;
  }
  return folded;
}

export function matchCalendar(match: CalendarMatch, summary: string, createdAt = new Date()): string {
  const start = new Date(match.starts_at);
  const end = new Date(slotEndTime(start.getTime(), match.duration_in_minutes));
  const location = [match.pitch.name, match.pitch.municipality, match.pitch.area].filter(Boolean).join(", ");
  const matchUrl = "https://ondejogamos.com" + AppRoutes.MATCH_DETAILS(match.id);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Onde Jogamos//Match calendar//EN",
    "BEGIN:VEVENT",
    "UID:match-" + match.id + "@ondejogamos.com",
    "DTSTAMP:" + calendarDate(createdAt),
    "DTSTART:" + calendarDate(start),
    "DTEND:" + calendarDate(end),
    "SUMMARY:" + calendarText(summary),
    "LOCATION:" + calendarText(location),
    "URL:" + matchUrl,
    "DESCRIPTION:" + calendarText(matchUrl),
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].map(foldCalendarLine).join("\r\n");
}
