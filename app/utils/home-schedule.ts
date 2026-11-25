import { validAgendaDay } from "./agenda-date";
import { parseLisbonSlot } from "./lisbon-slot";

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

export function matchesPitchSearch(pitch: { name: string; municipality: string }, query: string) {
  const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const text = normalize(`${pitch.name} ${pitch.municipality}`);
  return normalize(query).trim().split(/\s+/).every((word) => text.includes(word));
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
