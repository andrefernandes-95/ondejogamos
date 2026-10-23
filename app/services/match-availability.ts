import { PoolClient } from "pg";
import { matchTimeRangesOverlap, MatchTimeRange } from "@/app/utils/match-time";

export interface MatchAvailabilityInput extends MatchTimeRange {
  pitchId: string;
  ignoreMatchId?: number;
}

export class MatchTimeConflictError extends Error {
  constructor() {
    super("MATCH_TIME_CONFLICT");
    this.name = "MatchTimeConflictError";
  }
}

export async function ensureMatchTimeAvailable(
  client: PoolClient,
  input: MatchAvailabilityInput,
): Promise<void> {
  await client.query('SELECT id FROM "pitches" WHERE id = $1 FOR UPDATE', [
    input.pitchId,
  ]);

  const candidates = await client.query<MatchTimeRange>(
    `
      SELECT starts_at AS "startsAt", duration_in_minutes AS "durationInMinutes"
      FROM "matches"
      WHERE pitch_id = $1
        AND starts_at < $2::timestamptz
        AND starts_at + duration_in_minutes * INTERVAL '1 minute' > $3::timestamptz
        AND ($4::bigint IS NULL OR id <> $4::bigint)
    `,
    [
      input.pitchId,
      new Date(new Date(input.startsAt).getTime() + input.durationInMinutes * 60_000),
      input.startsAt,
      input.ignoreMatchId ?? null,
    ],
  );

  if (candidates.rows.some((candidate) => matchTimeRangesOverlap(candidate, input))) {
    throw new MatchTimeConflictError();
  }
}
