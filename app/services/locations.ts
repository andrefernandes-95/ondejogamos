import { pool } from "@/app/lib/db";

export type Location = {
  area: string;
  municipality: string;
};

export async function listLocations(): Promise<Location[]> {
  const result = await pool.query(`
            select area, municipality from locations
            order by area
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
