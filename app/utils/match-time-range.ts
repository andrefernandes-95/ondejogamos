interface MatchTimeRange {
  startsAt: Date | string;
  durationInMinutes: number;
}

export function slotEndTime(startTime: number, durationInMinutes: number): number {
  return startTime + durationInMinutes * 60_000;
}

export function matchSlotsOverlap(first: MatchTimeRange, second: MatchTimeRange): boolean {
  if (first.durationInMinutes <= 0 || second.durationInMinutes <= 0) {
    return false;
  }
  const firstStart = new Date(first.startsAt).getTime();
  const secondStart = new Date(second.startsAt).getTime();
  const firstEnd = slotEndTime(firstStart, first.durationInMinutes);
  const secondEnd = slotEndTime(secondStart, second.durationInMinutes);

  return firstStart < secondEnd && secondStart < firstEnd;
}
