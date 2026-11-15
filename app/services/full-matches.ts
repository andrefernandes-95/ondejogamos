import { pool } from "@/app/lib/db";
import type { FullMatch } from "@/app/models/match";
import { publicPlayerIdentity } from "./public-player-projection";

const fullMatchQuery = (details = false) => `
  SELECT
    m.id, m.starts_at, m.format, m.description, m.min_attendance,
    ${details ? "m.duration_in_minutes," : ""}
    json_build_object(
      'id', p.id, 'area', p.area, 'municipality', p.municipality,
      'name', p.name, 'image_url', p.image_url, 'maps_url', p.maps_url
    ) AS pitch,
    ${details ? "jsonb_build_object('id', host.id) ||" : ""}
    ${publicPlayerIdentity("host", "host_profile")} AS creator,
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'user_id', attendee.id, 'user_name', attendee.name, 'created_at', a.created_at,
        'player', ${publicPlayerIdentity("attendee", "attendee_profile")}
      ) ORDER BY a.created_at, a.id)
      FROM attendance AS a
      JOIN "user" AS attendee ON attendee.id = a.user_id
      LEFT JOIN player_profiles AS attendee_profile ON attendee_profile.user_id = attendee.id
      WHERE a.match_id = m.id
    ), '[]'::jsonb) AS attendances,
    EXISTS(SELECT 1 FROM attendance AS a WHERE a.match_id = m.id AND a.user_id = $1) AS is_attending,
    COALESCE(m.created_by = $1, false) AS is_creator
  FROM matches AS m
  JOIN pitches AS p ON p.id = m.pitch_id
  JOIN "user" AS host ON host.id = m.created_by
  LEFT JOIN player_profiles AS host_profile ON host_profile.user_id = host.id
`;

export async function listFullMatches(area: string, userId: string): Promise<FullMatch[]> {
  const { rows } = await pool.query<FullMatch>(
    `${fullMatchQuery()} WHERE p.area = $2 AND m.starts_at >= NOW() ORDER BY m.starts_at, m.id`,
    [userId, area],
  );
  return rows;
}

export async function listAllMatches(userId: string): Promise<FullMatch[]> {
  const { rows } = await pool.query<FullMatch>(
    `${fullMatchQuery()} WHERE m.starts_at >= NOW() ORDER BY m.starts_at, m.id`, [userId],
  );
  return rows;
}

export async function getFullMatchById(id: number, userId?: string | null): Promise<FullMatch | null> {
  const { rows } = await pool.query<FullMatch>(
    `${fullMatchQuery(true)} WHERE m.id = $2`,
    [userId, id],
  );
  return rows[0] ?? null;
}
