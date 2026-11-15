import { pool } from "@/app/lib/db";

export async function getCardStats(userId: string) {
  const { rows } = await pool.query<{ played: number; created: number }>(
    `SELECT
       (SELECT count(*)::int FROM attendance a JOIN matches m ON m.id = a.match_id
        WHERE a.user_id = $1 AND m.cancelled_at IS NULL
          AND m.starts_at + m.duration_in_minutes * interval '1 minute' <= now()) AS played,
       (SELECT count(*)::int FROM matches
        WHERE created_by = $1 AND cancelled_at IS NULL) AS created`,
    [userId],
  );
  return rows[0];
}
