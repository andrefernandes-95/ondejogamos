import { pool } from "@/app/lib/db";

export interface Location {
  area: string;
  municipality: string;
}

export interface LocationWithGameCount extends Location {
  game_count: number;
}

export async function listLocations(): Promise<Location[]> {
  const result = await pool.query(`
            select area, municipality from locations
            order by area
        `);

  return result.rows;
}

export async function listLocationsWithGameCount(): Promise<
  LocationWithGameCount[]
> {
  const result = await pool.query(`
            SELECT
              l.area,
              l.municipality,
              COUNT(m.id)::int AS game_count
            FROM "locations" AS l
            LEFT JOIN "pitches" AS p ON p.municipality = l.municipality AND p.municipality = l.municipality
            LEFT JOIN "matches" AS m ON m.pitch_id = p.id
            GROUP BY l.area, l.municipality
            ORDER BY area
        `);
  return result.rows;
}

export async function listMunicipalitiesForArea(
  area: string,
): Promise<string[]> {
  const result = await pool.query(
    `
            select municipality from locations
            where area = $1
            order by municipality
        `,
    [area],
  );

  const resultingRows: { municipality: string }[] = result.rows;

  return resultingRows.flatMap((entry) => entry.municipality);
}
