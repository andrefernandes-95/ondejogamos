import { pool } from "@/app/lib/db";
import { Match } from "@/app/models/match";

export async function listMatches(area: string): Promise<Match[]> {
  const result = await pool.query(
    `
            SELECT 
              matches.id,
              matches.starts_at,
              matches.format,
              matches.description,
              pitches.area as pitchArea,
              pitches.municipality as pitchMunicipality,
              pitches.name as pitchName,
              pitches.image_url
            FROM matches
            LEFT JOIN pitches ON matches.pitch_id = pitches.id
            WHERE area = $1
            ORDER BY starts_at
        `,
    [area],
  );

  return result.rows;
}

export type SaveMatchInput = {
  pitchId: string;
  description: string;
  format: string;
  minAttendance: number;
  startsAt: string;
  createdBy: string;
};

export async function saveMatch(pitch: SaveMatchInput): Promise<Match> {
  const result = await pool.query(
    `
      INSERT INTO MATCHES(
        created_by, pitch_id, description, format, min_attendance, starts_at
      ) values ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [
      pitch.createdBy,
      pitch.pitchId,
      pitch.description,
      pitch.format,
      pitch.minAttendance,
      pitch.startsAt,
    ],
  );

  return result.rows[0];
}
