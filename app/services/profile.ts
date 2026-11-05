import { pool } from "@/app/lib/db";
import { UserProfile } from "@/app/models/user-profile";

export async function getProfile(userId: string): Promise<UserProfile> {
  const result = await pool.query(
    `
      SELECT (
        date_of_birth,
        preferred_area,
        preferred_position,
        avatar_url,
        avatar_storage_key
      ) FROM "player_profiles"
      WHERE user_id = $1
    `,
    [userId],
  );

  return result.rows?.[0] ?? null;
}
