import { pool } from "@/app/lib/db";
import type { CardUpdate } from "@/app/schemas/player-card";

export async function savePlayerCard(userId: string, data: CardUpdate, uploadedKey: string | null) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "INSERT INTO player_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
      [userId],
    );
    const { rows: [current] } = await client.query<{
      avatar_storage_key: string | null; public_id: string;
    }>("SELECT avatar_storage_key, public_id FROM player_profiles WHERE user_id = $1 FOR UPDATE", [userId]);

    const previousKey = current.avatar_storage_key;
    const nextKey = data.photoAction === "keep" ? previousKey : uploadedKey;
    await client.query(
      `UPDATE player_profiles SET preferred_area = $2, preferred_position = $3,
       visible_fields = $4, selected_badges = $5, published = $6,
       avatar_storage_key = $7,
       avatar_url = CASE WHEN $8 THEN avatar_url ELSE NULL END, updated_at = now()
       WHERE user_id = $1`,
      [userId, data.area, data.position, data.visible, data.badges, data.published,
        nextKey, data.photoAction === "keep"],
    );

    if (previousKey && previousKey !== nextKey && previousKey.startsWith("player-portraits/")) {
      await client.query(
        "INSERT INTO player_portrait_cleanup (storage_key) VALUES ($1) ON CONFLICT DO NOTHING",
        [previousKey],
      );
    }

    await client.query("COMMIT");
    return current.public_id;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
