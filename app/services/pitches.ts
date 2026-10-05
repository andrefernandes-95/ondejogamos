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
  image?: File | null;
  image_url: string;
};

export async function listPitches(): Promise<Location[]> {
  const result = await pool.query(`
            select * from pitches
            order by name
        `);

  return result.rows;
}

export async function savePitch(pitch: Partial<Pitch>): Promise<Pitch> {
  const result = await pool.query(
    `
      insert into pitches(name, area, municipality, maps_url, image_url) values ($1, $2, $3, $4, $5)
      returning *
    `,
    [
      pitch.name,
      pitch.area,
      pitch.municipality,
      pitch.maps_url,
      pitch.image_url,
    ],
  );

  return result.rows[0];
}
