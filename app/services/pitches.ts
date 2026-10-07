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
