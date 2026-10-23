export interface MatchTimeRange {
  startsAt: Date | string;
  durationInMinutes: number;
}

export function matchTimeRangesOverlap(
  first: MatchTimeRange,
  second: MatchTimeRange,
): boolean {
  const millisecondsPerMinute = 60 * 1_000;
  const firstStartsAt = new Date(first.startsAt).getTime();
  const secondStartsAt = new Date(second.startsAt).getTime();
  const firstEndsAt = firstStartsAt + first.durationInMinutes * millisecondsPerMinute;
  const secondEndsAt = secondStartsAt + second.durationInMinutes * millisecondsPerMinute;

  const firstStartsBeforeSecondEnds = firstStartsAt < secondEndsAt;
  const secondStartsBeforeFirstEnds = secondStartsAt < firstEndsAt;

  return firstStartsBeforeSecondEnds && secondStartsBeforeFirstEnds;
}
