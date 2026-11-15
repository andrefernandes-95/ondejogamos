import { pool } from "@/app/lib/db";
import { isDatabasePortrait } from "@/app/lib/portrait-storage";
import type { CardUpdate } from "@/app/schemas/player-card";

export async function savePlayerCard(
  userId: string, data: CardUpdate, uploadedKey: string | null, databasePortrait: Buffer | null,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: [user] } = await client.query<{ name: string }>(
      'SELECT name FROM "user" WHERE id = $1 FOR NO KEY UPDATE', [userId],
    );
    const name = data.name ?? user.name;
    if (name !== user.name) {
      await client.query('UPDATE "user" SET name = $2, "updatedAt" = now() WHERE id = $1', [userId, name]);
    }
    const { rows: [current] } = await client.query<{
      avatar_storage_key: string | null;
    }>("SELECT avatar_storage_key FROM player_profiles WHERE user_id = $1 FOR UPDATE", [userId]);

    const previousKey = current.avatar_storage_key;
    const nextKey = data.photoAction === "keep" ? previousKey : uploadedKey;
    const { rows: [updated] } = await client.query<{ public_slug: string }>(
      `UPDATE player_profiles SET preferred_area = $2, preferred_position = $3,
       visible_fields = $4, selected_badges = $5, avatar_storage_key = $6,
       avatar_bytes = CASE WHEN $7 THEN avatar_bytes ELSE $8::bytea END,
       avatar_url = CASE WHEN $7 THEN avatar_url ELSE NULL END, updated_at = now()
       WHERE user_id = $1 RETURNING public_slug`,
      [userId, data.area, data.position, data.visible, data.badges,
        nextKey, data.photoAction === "keep", databasePortrait],
    );

    if (previousKey && previousKey !== nextKey && previousKey.startsWith("player-portraits/") &&
      !isDatabasePortrait(previousKey)) {
      await client.query(
        "INSERT INTO player_portrait_cleanup (storage_key) VALUES ($1) ON CONFLICT DO NOTHING",
        [previousKey],
      );
    }

    await client.query("COMMIT");
    return { slug: updated.public_slug, name };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
