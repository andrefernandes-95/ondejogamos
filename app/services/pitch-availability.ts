import { pool } from "@/app/lib/db";
import type { Pool, PoolClient } from "pg";

export interface OccupiedMatchSlot {
  id: string;
  starts_at: Date | string;
  duration_in_minutes: number;
}

export async function getPitchMatchesForDateInterval(
  pitchId: string,
  from: string,
  until: string,
  db: Pool | PoolClient = pool,
): Promise<OccupiedMatchSlot[]> {
  const { rows } = await db.query<OccupiedMatchSlot>(
    `SELECT id, starts_at, duration_in_minutes
     FROM matches
     WHERE pitch_id = $1 AND cancelled_at IS NULL
       AND starts_at < $3::timestamptz
       AND starts_at + duration_in_minutes * INTERVAL '1 minute' > $2::timestamptz
     ORDER BY starts_at, id`,
    [pitchId, from, until],
  );
  return rows;
}
