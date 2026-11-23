import { pool } from "@/app/lib/db";

export interface OrganizedMatch {
  id: string;
  pitch_name: string;
  starts_at: Date;
  status: "pending" | "played" | "cancelled" | "upcoming" | "ongoing";
}

export async function listOrganizedMatches(
  organizerId: string,
  db = pool,
): Promise<OrganizedMatch[]> {
  const { rows } = await db.query<OrganizedMatch>(
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
     WHERE m.created_by = $1
     ORDER BY m.starts_at DESC, m.id DESC
     LIMIT 30`,
    [organizerId],
  );
  return rows;
}
