import { pool } from "@/app/lib/db";

export async function confirmMatchPlayed(matchId: number, organizerId: string, db = pool) {
  const { rows } = await db.query<{ played_confirmed_at: Date }>(
    `UPDATE matches
     SET played_confirmed_at = COALESCE(played_confirmed_at, clock_timestamp())
     WHERE id = $1 AND created_by = $2 AND cancelled_at IS NULL
       AND starts_at + duration_in_minutes * INTERVAL '1 minute' <= clock_timestamp()
     RETURNING played_confirmed_at`,
    [matchId, organizerId],
  );

  if (rows[0]) {
    return { status: "confirmed", confirmedAt: rows[0].played_confirmed_at } as const;
  }

  const owned = await db.query(
    "SELECT 1 FROM matches WHERE id = $1 AND created_by = $2",
    [matchId, organizerId],
  );
  return { status: owned.rowCount ? "unavailable" : "not_found" } as const;
}
