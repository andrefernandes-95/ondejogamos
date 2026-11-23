import { pool } from "@/app/lib/db";

export interface Location {
  area: string;
  municipality: string;
}

export interface LocationWithGameCount extends Location {
  game_count: number;
}

export async function listAreas(): Promise<string[]> {
  const result = await pool.query<{ area: string }>(
    "SELECT DISTINCT area FROM locations ORDER BY area",
  );
  return result.rows.map(({ area }) => area);
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
            LEFT JOIN "pitches" AS p ON p.municipality = l.municipality AND p.area = l.area
            LEFT JOIN "matches" AS m ON m.pitch_id = p.id AND m.starts_at >= NOW() AND m.cancelled_at IS NULL
            GROUP BY l.area, l.municipality
            ORDER BY l.area, l.municipality
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
