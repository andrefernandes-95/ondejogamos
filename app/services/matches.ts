import { pool } from "@/app/lib/db";
import type { Match } from "@/app/models/match";

export { getFullMatchById, listAllMatches, listFullMatches } from "./full-matches";
export { saveMatch, updateMatch, type SaveMatchInput, type UpdateMatchInput } from "./match-writes";
export { deleteMatch } from "./delete-match";

export async function listMatches(area: string): Promise<Match[]> {
  const result = await pool.query(
    `
            SELECT 
              matches.id,
              matches.starts_at AS "startsAt",
              matches.format,
              matches.description,
              json_build_object(
                'id', pitches.id,
                'area', pitches.area,
                'municipality', pitches.municipality,
                'name', pitches.name,
                'image_url', pitches.image_url,
                'maps_url', pitches.maps_url
              ) AS pitch
            FROM matches
            LEFT JOIN pitches ON matches.pitch_id = pitches.id
            WHERE area = $1
            ORDER BY starts_at
        `,
    [area],
  );

  return result.rows;
}

export async function getPitchMatchesForDateInterval(
  pitch_id: string,
  from: string,
  until: string,
): Promise<Match[]> {
  const result = await pool.query(
    `
            SELECT m.*
            FROM "matches" AS m
            WHERE
              m.pitch_id = $1
              AND m.starts_at < $3::timestamptz
              AND (
                m.starts_at + m.duration_in_minutes * INTERVAL '1 minute'
              ) > $2::timestamptz
            ORDER BY m.starts_at DESC, m.id DESC
        `,
    [pitch_id, from, until],
  );

  return result.rows;
}
