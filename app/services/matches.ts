import { pool } from "@/app/lib/db";
import { FullMatch, Match } from "@/app/models/match";

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

export async function listFullMatches(
  area: string,
  user_id: string,
): Promise<FullMatch[]> {
  const result = await pool.query(
    `
      SELECT 
        m.id,
        m.starts_at,
        m.format,
        m.description,
        m.min_attendance,

        json_build_object(
          'id', p.id,
          'area', p.area,
          'municipality', p.municipality,
          'name', p.name,
          'image_url', p.image_url,
          'maps_url', p.maps_url
        ) AS pitch,

        -- Build attendance array with user details --
        COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'user_id', u.id,
                'user_name', u.name,
                'created_at', a.created_at
              )
            )
            FROM attendance AS a
            JOIN "user" AS u ON a.user_id = u.id
            WHERE a.match_id = m.id
          ),
          '[]'::jsonb
        ) AS attendances,

        -- Is current user attending ? --
        EXISTS(
          SELECT 1
          FROM attendance AS a
          WHERE a.match_id = m.id
            AND a.user_id = $2
        ) AS is_attending,
         
        COALESCE(m.created_by = $2, false) AS is_creator

      FROM matches AS m
      JOIN pitches AS p on p.id = m.pitch_id
      WHERE p.area = $1 AND m.starts_at >= NOW()
      ORDER BY m.starts_at, m.id
        `,
    [area, user_id],
  );

  return result.rows;
}

export async function listAllMatches(user_id: string): Promise<FullMatch[]> {
  const result = await pool.query(
    `
      SELECT 
        m.id,
        m.starts_at,
        m.format,
        m.description,
        m.min_attendance,

        json_build_object(
          'id', p.id,
          'area', p.area,
          'municipality', p.municipality,
          'name', p.name,
          'image_url', p.image_url,
          'maps_url', p.maps_url
        ) AS pitch,

        -- Build attendance array with user details --
        COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'user_id', u.id,
                'user_name', u.name,
                'created_at', a.created_at
              )
            )
            FROM attendance AS a
            JOIN "user" AS u ON a.user_id = u.id
            WHERE a.match_id = m.id
          ),
          '[]'::jsonb
        ) AS attendances,

        -- Is current user attending ? --
        EXISTS(
          SELECT 1
          FROM attendance AS a
          WHERE a.user_id = $1 AND m.id = a.match_id
        ) AS is_attending,
         
        COALESCE(m.created_by = $1, false) AS is_creator

      FROM matches AS m
      JOIN pitches AS p on p.id = m.pitch_id
      WHERE m.starts_at >= NOW()
      ORDER BY m.starts_at, m.id
        `,
    [user_id],
  );

  return result.rows;
}

export async function getFullMatchById(
  id: number,
  user_id: string | null | undefined,
): Promise<FullMatch> {
  const result = await pool.query(
    `
      SELECT
        m.id,
        m.starts_at,
        m.format,
        m.description,
        m.min_attendance,
        m.duration_in_minutes,

        json_build_object(
          'id', p.id,
          'area', p.area,
          'municipality', p.municipality,
          'name', p.name,
          'image_url', p.image_url,
          'maps_url', p.maps_url
        ) AS pitch,

        json_build_object(
          'id', u.id,
          'name', u.name
        ) AS creator,

        -- Build attendance array with user details --
        COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'user_id', u.id,
                'user_name', u.name,
                'created_at', a.created_at
              )
            )
            FROM attendance AS a
            JOIN "user" AS u ON a.user_id = u.id
            WHERE a.match_id = m.id
          ),
          '[]'::jsonb
        ) AS attendances,

        -- Is current user attending ? --
        EXISTS(
          SELECT 1
          FROM attendance AS a
          WHERE a.match_id = m.id
            AND a.user_id = $2
        ) AS is_attending,
         
        COALESCE(m.created_by = $2, false) AS is_creator

      FROM matches AS m
      JOIN pitches AS p on p.id = m.pitch_id
      JOIN "user" AS u on u.id = m.created_by
      WHERE m.id = $1
      ORDER BY m.starts_at, m.id
        `,
    [id, user_id],
  );

  return result.rows?.[0] ?? null;
}

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
): Promise<Match> {
  const result = await pool.query(
    `
      UPDATE MATCHES
      SET 
        pitch_id = $3,
        description = $4,
        format = $5,
        min_attendance = $6,
        starts_at = $7,
        duration_in_minutes = $8
      WHERE id = $1 AND created_by = $2
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

export async function deleteMatch(
  matchId: string,
  userId: string,
): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        SELECT id
        FROM "matches"
        WHERE id = $1 AND created_by = $2
        FOR UPDATE
      `,
      [matchId, userId],
    );

    if (result.rowCount === 0) {
      throw new Error(`Match not found or unauthorized`);
    }

    await client.query(
      `
      DELETE FROM "attendance"
      WHERE match_id = $1`,
      [matchId],
    );

    await client.query(
      `
      DELETE FROM "matches"
      WHERE id = $1 AND created_by = $2`,
      [matchId, userId],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
