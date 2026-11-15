import { pool } from "@/app/lib/db";

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
