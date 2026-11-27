import { pool } from "@/app/lib/db";

export async function getCardStatsForUsers(userIds: string[], db = pool) {
  if (!userIds.length) {
    return new Map<string, { played: number; created: number }>();
  }

  const { rows } = await db.query<{ user_id: string; played: number; created: number }>(
    `SELECT player.user_id,
       (SELECT count(*)::int FROM attendance a JOIN matches m ON m.id = a.match_id
        WHERE a.user_id = player.user_id AND m.cancelled_at IS NULL
          AND m.starts_at + m.duration_in_minutes * interval '1 minute' <= now()) AS played,
       (SELECT count(*)::int FROM matches
        WHERE created_by = player.user_id AND cancelled_at IS NULL) AS created
     FROM unnest($1::text[]) AS player(user_id)`,
    [userIds],
  );
  return new Map(rows.map(({ user_id, played, created }) => [user_id, { played, created }]));
}
