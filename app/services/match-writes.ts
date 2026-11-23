import { pool } from "@/app/lib/db";
import type { Match } from "@/app/models/match";

export type SaveMatchInput = {
  pitchId: string;
  description: string;
  format: string;
  minAttendance: number;
  startsAt: string;
  createdBy: string;
  durationInMinutes: number;
};

export async function saveMatch(pitch: SaveMatchInput): Promise<Match> {
  const result = await pool.query(
    `
      INSERT INTO MATCHES(
        created_by, pitch_id, description, format, min_attendance, starts_at, duration_in_minutes
      ) values ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    [
      pitch.createdBy,
      pitch.pitchId,
      pitch.description,
      pitch.format,
      pitch.minAttendance,
      pitch.startsAt,
      pitch.durationInMinutes,
    ],
  );

  return result.rows[0];
}

export interface UpdateMatchInput extends SaveMatchInput {
  id: number;
}

export async function updateMatch(
  match: UpdateMatchInput,
  userId: string,
  db = pool,
): Promise<Match | null> {
  const result = await db.query(
    `
      UPDATE MATCHES
      SET
        pitch_id = $3,
        description = $4,
        format = $5,
        min_attendance = $6,
        starts_at = $7,
        duration_in_minutes = $8
      WHERE id = $1 AND created_by = $2 AND starts_at > clock_timestamp()
      RETURNING *
    `,
    [
      match.id,
      userId,
      match.pitchId,
      match.description,
      match.format,
      match.minAttendance,
      match.startsAt,
      match.durationInMinutes,
    ],
  );

  return result.rows[0] ?? null;
}
