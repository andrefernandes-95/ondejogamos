import { pool } from "@/app/lib/db";

interface ProfileMatch {
  id: string;
  pitch_name: string;
  starts_at: Date;
  status: "pending" | "played" | "cancelled" | "upcoming" | "ongoing";
}

export type ProfileMatchView = "organized" | "joined";

export async function listProfileMatches(
  userId: string,
  view: ProfileMatchView,
  db = pool,
): Promise<ProfileMatch[]> {
  const belongsToUser = view === "organized"
    ? "m.created_by = $1"
    : "EXISTS (SELECT 1 FROM attendance WHERE match_id = m.id AND user_id = $1)";
  const { rows } = await db.query<ProfileMatch>(
    `SELECT m.id, p.name AS pitch_name, m.starts_at,
       CASE
         WHEN m.cancelled_at IS NOT NULL THEN 'cancelled'
         WHEN m.played_confirmed_at IS NOT NULL THEN 'played'
         WHEN m.starts_at > NOW() THEN 'upcoming'
         WHEN m.starts_at + m.duration_in_minutes * INTERVAL '1 minute' > NOW() THEN 'ongoing'
         ELSE 'pending'
       END AS status
     FROM matches AS m
     JOIN pitches AS p ON p.id = m.pitch_id
     WHERE ${belongsToUser}
     ORDER BY (m.starts_at > NOW()) DESC,
       CASE WHEN m.starts_at > NOW() THEN m.starts_at END,
       m.starts_at DESC, m.id DESC
     LIMIT 30`,
    [userId],
  );
  return rows;
}
