import { validAgendaDay } from "./agenda-date";
import { parseLisbonSlot } from "./lisbon-slot";
import type { CreateMatchFormValues } from "@/app/schemas/match";

export const scheduleFormats = ["5x5", "7x7", "11x11"] as const;
export const minimumPlayersByFormat = { "5x5": 10, "7x7": 14, "11x11": 22 };
export const scheduleDraftKeys = ["schedulePitch", "scheduleDay", "scheduleTime", "scheduleArea", "scheduleFormat", "scheduleDuration"];

export function readScheduleOptions(params: URLSearchParams): {
  format: CreateMatchFormValues["format"];
  duration: number;
} {
  const duration = Number(params.get("scheduleDuration"));
  return {
    format: scheduleFormats.find((format) => format === params.get("scheduleFormat")) ?? "5x5",
    duration: Number.isInteger(duration) && duration >= 30 && duration <= 1440 ? duration : 60,
  };
}

export function homeView(params: URLSearchParams) {
  const view = params.get("view");
  if (view === "games" || view === "schedule") {
    return view;
  }
  return ["area", "municipality", "date"].some((key) => params.has(key)) ? "games" : "schedule";
}

export function readScheduleSlot(params: URLSearchParams) {
  const pitchId = params.get("schedulePitch");
  const day = params.get("scheduleDay");
  const time = params.get("scheduleTime");
  if (!pitchId || !/^[1-9]\d*$/.test(pitchId) || !validAgendaDay(day) || !time) {
    return null;
  }
  const startsAt = parseLisbonSlot(day, time)?.toISOString();
  return startsAt ? { pitchId, day, time, startsAt } : null;
}

export function normalizeLocationSearch(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

export function matchesPitchSearch(pitch: { name: string; municipality: string; area?: string }, query: string) {
  const text = normalizeLocationSearch(`${pitch.name} ${pitch.municipality} ${pitch.area ?? ""}`);
  return normalizeLocationSearch(query).split(/[\s,]+/).every((word) => text.includes(word));
}

export function updateHomeSearch(changes: Record<string, string | null>, replace = false) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(changes)) {
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  }
  if (url.href !== window.location.href) {
    if (replace) {
      window.history.replaceState(null, "", url);
    } else {
      window.history.pushState(null, "", url);
    }
  }
}
