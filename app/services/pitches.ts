import { pool } from "@/app/lib/db";

export type Pitch = {
  id: number;
  area: string;
  municipality: string;
  name: string;
  description: string;
  address: string;
  maps_url: string;
  created_at: string;
  image_url: string;
  created_by: string;
};

export interface PitchFull extends Pitch {
  game_count: number;
  is_creator: boolean;
}

export async function listPitchesForArea(
  area: string,
): Promise<SavePitchInput[]> {
  const result = await pool.query(
    `
            SELECT id, name, image_url, maps_url, municipality FROM pitches
            WHERE area = $1
            ORDER BY name
        `,
    [area],
  );

  return result.rows;
}

export async function listAllPitches(user_id: string): Promise<PitchFull[]> {
  const result = await pool.query(
    `
            SELECT
              p.id,
              p.name,
              p.area,
              p.municipality,
              p.image_url,
              p.maps_url,
              p.municipality,
              p.created_at,
              u.name AS created_by,
              COUNT(m.id)::int AS game_count,
              COALESCE(p.created_by = $1, false) AS is_creator
            FROM pitches AS p
            LEFT JOIN "user" AS u ON created_by = u.id
            LEFT JOIN "matches" AS m ON m.pitch_id = p.id
            GROUP BY p.id, u.name
            ORDER BY name
        `,
    [user_id],
  );

  return result.rows;
}

export async function suggestPitches(
  area: string = "",
  limit: number = 5,
): Promise<SavePitchInput[]> {
  const result = await pool.query(
    `
            SELECT
              id, name, image_url, maps_url, municipality, area
            FROM pitches
            WHERE (NULLIF($1::text, '') IS NULL OR area = $1)
            ORDER BY RANDOM()
            LIMIT $2
        `,
    [area, limit],
  );

  return result.rows;
}

export type SavePitchInput = Pick<
  Pitch,
  "name" | "area" | "municipality" | "maps_url" | "image_url" | "created_by"
>;

export async function savePitch(pitch: SavePitchInput): Promise<Pitch> {
  const result = await pool.query(
    `
      INSERT INTO PITCHES(
        name, area, municipality, maps_url, image_url, created_by
      ) values ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (area, municipality, name)
      DO UPDATE SET
        maps_url = EXCLUDED.maps_url,
        image_url = EXCLUDED.image_url
      RETURNING *
    `,
    [
      pitch.name,
      pitch.area,
      pitch.municipality,
      pitch.maps_url,
      pitch.image_url,
      pitch.created_by,
    ],
  );

  return result.rows[0];
}

export async function updatePitch(
  pitch: Partial<PitchFull>,
  user_session_id: string,
): Promise<Pitch> {
  console.log(pitch);
  const result = await pool.query(
    `
      UPDATE "pitches"
      SET
        name = $1,
        municipality = $2,
        image_url = $3,
        maps_url = $4
      WHERE id = $5 AND created_by = $6
      RETURNING *
    `,
    [
      pitch.name,
      pitch.municipality,
      pitch.image_url,
      pitch.maps_url,
      pitch.id,
      user_session_id,
    ],
  );

  return result.rows?.[0] ?? null;
}

export async function getPitchById(id: number): Promise<Pitch> {
  const result = await pool.query(
    `
      SELECT * FROM "pitches"
      WHERE id = $1
    `,
    [id],
  );

  return result.rows?.[0] ?? null;
}

export async function deleteFromPitch(
  pitch_id: string,
  user_session_id: string,
): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        SELECT id
        FROM "pitches"
        WHERE id = $1 AND created_by = $2
        FOR UPDATE
      `,
      [pitch_id, user_session_id],
    );

    if (result.rowCount === 0) {
      throw new Error(`PITCH_HAS_ACTIVE_MATCHES`);
    }

    // Block matches
    await client.query(
      `
        SELECT id
        FROM "matches"
        WHERE pitch_id = $1
        ORDER BY id
        FOR UPDATE
      `,
      [pitch_id],
    );

    const gamesHappening = await client.query(
      `
        SELECT
          EXISTS (
            SELECT 1
            FROM matches
            WHERE pitch_id = $1
            AND starts_at
              + duration_in_minutes * INTERVAL '1 minute'
              > NOW()
          ) AS has_matches_ongoing
      `,
      [pitch_id],
    );

    if (gamesHappening.rows?.[0]?.has_matches_ongoing) {
      throw new Error(`Pitch has ongoing matches scheduled`);
    }

    await client.query(
      `
      DELETE FROM "attendance"
      WHERE match_id IN (
        SELECT id
        FROM "matches"
        WHERE pitch_id = $1
      )`,
      [pitch_id],
    );

    await client.query(
      `
      DELETE FROM "matches"
      WHERE pitch_id = $1`,
      [pitch_id],
    );

    await client.query(
      `
      DELETE FROM "pitches"
      WHERE id = $1 AND created_by = $2`,
      [pitch_id, user_session_id],
    );

    await client.query(`COMMIT`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
