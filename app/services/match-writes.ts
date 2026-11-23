import { pool } from "@/app/lib/db";
import type { Match } from "@/app/models/match";
import { slotEndTime } from "@/app/utils/match-time-range";
import type { PoolClient } from "pg";
import { getPitchMatchesForDateInterval } from "./pitch-availability";

export type SaveMatchInput = {
  pitchId: string;
  description: string;
  format: string;
  minAttendance: number;
  startsAt: string;
  createdBy: string;
  durationInMinutes: number;
};

export interface UpdateMatchInput extends SaveMatchInput {
  id: number;
}

export class MatchScheduleError extends Error {
  constructor(public readonly code: "PITCH_NOT_FOUND" | "MATCH_TIME_CONFLICT") {
    super(code);
  }
}

async function withPitchScheduleLock<T>(
  pitchId: string,
  db: typeof pool,
  write: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await db.connect();
  try {
    await client.query("BEGIN ISOLATION LEVEL READ COMMITTED");
    // Read availability only after acquiring the same lock as other writers.
    const pitch = await client.query(
      "SELECT id FROM pitches WHERE id = $1 FOR NO KEY UPDATE",
      [pitchId],
    );
    if (!pitch.rowCount) {
      throw new MatchScheduleError("PITCH_NOT_FOUND");
    }
    const result = await write(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function ensurePitchIsAvailable(
  client: PoolClient,
  match: SaveMatchInput,
  excludedMatchId?: number,
) {
  const endsAt = new Date(slotEndTime(Date.parse(match.startsAt), match.durationInMinutes));
  const overlaps = await getPitchMatchesForDateInterval(
    match.pitchId, match.startsAt, endsAt.toISOString(), client,
  );
  if (overlaps.some(({ id }) => id !== String(excludedMatchId))) {
    throw new MatchScheduleError("MATCH_TIME_CONFLICT");
  }
}

export async function saveMatch(match: SaveMatchInput, db = pool): Promise<Match> {
  const startsAt = new Date(match.startsAt).toISOString();
  return withPitchScheduleLock(match.pitchId, db, async (client) => {
    await ensurePitchIsAvailable(client, { ...match, startsAt });
    const { rows } = await client.query<Match>(
      `INSERT INTO matches (
        created_by, pitch_id, description, format, min_attendance, starts_at, duration_in_minutes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        match.createdBy, match.pitchId, match.description, match.format,
        match.minAttendance, startsAt, match.durationInMinutes,
      ],
    );
    return rows[0];
  });
}

export async function updateMatch(
  match: UpdateMatchInput,
  userId: string,
  db = pool,
): Promise<Match | null> {
  const startsAt = new Date(match.startsAt).toISOString();
  return withPitchScheduleLock(match.pitchId, db, async (client) => {
    const current = await client.query(
      `SELECT id FROM matches
       WHERE id = $1 AND created_by = $2 AND cancelled_at IS NULL AND starts_at > clock_timestamp()
       FOR UPDATE`,
      [match.id, userId],
    );
    if (!current.rowCount) {
      return null;
    }

    await ensurePitchIsAvailable(client, { ...match, startsAt }, match.id);
    const { rows } = await client.query<Match>(
      `UPDATE matches
       SET pitch_id = $3, description = $4, format = $5,
           min_attendance = $6, starts_at = $7, duration_in_minutes = $8
       WHERE id = $1 AND created_by = $2 AND cancelled_at IS NULL AND starts_at > clock_timestamp()
       RETURNING *`,
      [
        match.id, userId, match.pitchId, match.description, match.format,
        match.minAttendance, startsAt, match.durationInMinutes,
      ],
    );
    return rows[0] ?? null;
  });
}
