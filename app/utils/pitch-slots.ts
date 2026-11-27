import { parseLisbonSlot } from "./lisbon-slot";
import { matchSlotsOverlap } from "./match-time-range";

export const scheduleTimes = Array.from({ length: 48 }, (_, index) =>
  `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`);

export function scheduleCandidates(day: string, now: number) {
  return scheduleTimes.flatMap((time) => {
    const startsAt = parseLisbonSlot(day, time);
    if (!startsAt || startsAt.valueOf() <= now) {
      return [];
    }
    return [{ time, startsAt: startsAt.toDate() }];
  });
}

export function availablePitchTimes(
  candidates: ReturnType<typeof scheduleCandidates>,
  occupied: { starts_at: Date | string; duration_in_minutes: number }[],
  duration: number,
) {
  return candidates.filter(({ startsAt }) => !occupied.some((match) => matchSlotsOverlap(
    { startsAt, durationInMinutes: duration },
    { startsAt: match.starts_at, durationInMinutes: match.duration_in_minutes },
  ))).map(({ time }) => time);
}
