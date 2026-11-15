import { pool } from "@/app/lib/db";
import type { PlayerPreferences, UserProfile } from "@/app/models/user-profile";

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const result = await pool.query<UserProfile>(
    `SELECT date_of_birth::text, preferred_area, preferred_position, avatar_url
     FROM player_profiles WHERE user_id = $1`,
    [userId],
  );

  return result.rows[0] ?? null;
}

export async function saveProfile(userId: string, preferences: PlayerPreferences) {
  await pool.query(
    `INSERT INTO player_profiles (user_id, preferred_area, preferred_position)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE SET
       preferred_area = EXCLUDED.preferred_area,
       preferred_position = EXCLUDED.preferred_position,
       updated_at = NOW()`,
    [userId, preferences.preferred_area, preferences.preferred_position],
  );
}