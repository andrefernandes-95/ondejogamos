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
      WHERE p.area = $1
      ORDER BY m.starts_at, m.id
        `,
    [area, user_id],
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
