import { pool } from "@/app/lib/db";

export async function cancelMatch(
  matchId: string,
  userId: string,
  db = pool,
): Promise<"cancelled" | "not_found" | "started"> {
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

    // Check the time after acquiring the lock shared with attendance.
    const changed = await client.query(
      `UPDATE matches
       SET cancelled_at = COALESCE(cancelled_at, clock_timestamp())
       WHERE id = $1 AND (cancelled_at IS NOT NULL OR starts_at > clock_timestamp())`,
      [matchId],
    );

    await client.query("COMMIT");
    return changed.rowCount ? "cancelled" : "started";
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
