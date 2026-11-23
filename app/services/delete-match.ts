import { pool } from "@/app/lib/db";

export async function deleteMatch(
  matchId: string,
  userId: string,
  db = pool,
): Promise<"deleted" | "not_found" | "started"> {
  const client = await db.connect();

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
      await client.query("ROLLBACK");
      return "not_found";
    }

    // Check the time after acquiring the lock, even if the request arrived earlier.
    const kickoff = await client.query<{ started: boolean }>(
      "SELECT starts_at <= clock_timestamp() AS started FROM matches WHERE id = $1",
      [matchId],
    );
    if (kickoff.rows[0].started) {
      await client.query("ROLLBACK");
      return "started";
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
    return "deleted";
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
