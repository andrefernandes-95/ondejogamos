import { pool } from "@/app/lib/db";
import { deletePortrait } from "@/app/lib/portrait-storage";

export async function queuePortraitCleanup(key: string) {
  await pool.query(
    "INSERT INTO player_portrait_cleanup (storage_key) VALUES ($1) ON CONFLICT DO NOTHING",
    [key],
  );
}

export async function drainPortraitCleanup(limit = 10) {
  const { rows } = await pool.query<{ storage_key: string }>(
    `SELECT c.storage_key FROM player_portrait_cleanup c
     WHERE NOT EXISTS (
       SELECT 1 FROM player_profiles p WHERE p.avatar_storage_key = c.storage_key
     )
     ORDER BY c.queued_at LIMIT $1`,
    [limit],
  );

  for (const { storage_key } of rows) {
    try {
      await deletePortrait(storage_key);
      await pool.query("DELETE FROM player_portrait_cleanup WHERE storage_key = $1", [storage_key]);
    } catch (error) {
      console.error("Player portrait cleanup failed", error);
    }
  }
}
