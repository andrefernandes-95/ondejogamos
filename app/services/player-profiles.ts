import { pool } from "@/app/lib/db";
import type { PoolClient } from "pg";
import { deletePlayerAvatar } from "@/app/services/player-avatar-storage";
import {
  PlayerPosition,
  PlayerProfileEditingPayload,
  PlayerProfilePublicDto,
} from "@/app/models/player-profile";
import { calculateAge, toDateOnly } from "@/app/utils/date";

interface ProfileRow {
  id: string;
  name: string;
  image: string | null;
  date_of_birth: Date | string | null;
  preferred_area: string | null;
  preferred_position: PlayerPosition | null;
}

function toProfileDtos(row: ProfileRow, matchesPlayed: number): {
  publicProfile: PlayerProfilePublicDto;
  editingProfile: PlayerProfileEditingPayload;
} {
  const dob = toDateOnly(row.date_of_birth);
  const publicProfile: PlayerProfilePublicDto = {
    id: row.id,
    name: row.name,
    image: row.image,
    age: calculateAge(dob),
    preferred_area: row.preferred_area,
    preferred_position: row.preferred_position,
    matches_played: Math.max(0, matchesPlayed),
  };
  return {
    publicProfile,
    editingProfile: { ...publicProfile, date_of_birth: dob },
  };
}

export async function getCurrentPlayerProfile(user: {
  id: string;
  name: string;
  image?: string | null;
}): Promise<{ publicProfile: PlayerProfilePublicDto; editingProfile: PlayerProfileEditingPayload }> {
  const result = await pool.query<ProfileRow>(
    `SELECT u.id, u.name, COALESCE(pp.avatar_url, u.image) AS image, pp.date_of_birth, pp.preferred_area, pp.preferred_position
     FROM "user" u LEFT JOIN player_profiles pp ON pp.user_id = u.id WHERE u.id = $1`,
    [user.id],
  );
  const row = result.rows[0] ?? {
    id: user.id,
    name: user.name,
    image: user.image ?? null,
    date_of_birth: null,
    preferred_area: null,
    preferred_position: null,
  };
  const matchesPlayed = await getMatchesPlayed(user.id);
  return toProfileDtos(row, matchesPlayed);
}

async function getMatchesPlayed(userId: string): Promise<number> {
  const result = await pool.query<{ matches_played: string | number }>(
    `SELECT COUNT(*) AS matches_played
     FROM attendance a
     JOIN matches m ON m.id = a.match_id
     WHERE a.user_id = $1
       AND m.cancelled_at IS NULL
       AND m.starts_at + m.duration_in_minutes * INTERVAL '1 minute' <= NOW()`,
    [userId],
  );
  return Math.max(0, Number(result.rows[0]?.matches_played) || 0);
}

export async function savePlayerProfile(input: {
  userId: string;
  name: string;
  date_of_birth: string | null;
  preferred_area: string | null;
  preferred_position: PlayerPosition | null;
  avatar?: { url: string; storageKey: string } | null;
}): Promise<{ publicProfile: PlayerProfilePublicDto; editingProfile: PlayerProfileEditingPayload }> {
  let client: PoolClient | null = null;
  let previousAvatarKey: string | null = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    await client.query(`UPDATE "user" SET name = $1, "updatedAt" = NOW() WHERE id = $2`, [input.name, input.userId]);
    const oldAvatar = await client.query<{ avatar_storage_key: string | null }>(
      "SELECT avatar_storage_key FROM player_profiles WHERE user_id = $1 FOR UPDATE",
      [input.userId],
    );
    previousAvatarKey = oldAvatar.rows[0]?.avatar_storage_key ?? null;
    await client.query(
      `INSERT INTO player_profiles (user_id, date_of_birth, preferred_area, preferred_position, avatar_url, avatar_storage_key)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         date_of_birth = EXCLUDED.date_of_birth,
         preferred_area = EXCLUDED.preferred_area,
         preferred_position = EXCLUDED.preferred_position,
         avatar_url = COALESCE(EXCLUDED.avatar_url, player_profiles.avatar_url),
         avatar_storage_key = COALESCE(EXCLUDED.avatar_storage_key, player_profiles.avatar_storage_key),
         updated_at = NOW()`,
      [input.userId, input.date_of_birth, input.preferred_area, input.preferred_position, input.avatar?.url ?? null, input.avatar?.storageKey ?? null],
    );
    await client.query("COMMIT");
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Could not roll back player profile update", rollbackError);
      }
    }
    if (input.avatar) {
      await deletePlayerAvatar(input.avatar.storageKey);
    }
    throw error;
  } finally {
    client?.release();
  }

  if (input.avatar && previousAvatarKey && previousAvatarKey !== input.avatar.storageKey) {
    await deletePlayerAvatar(previousAvatarKey);
  }

  const result = await pool.query<ProfileRow>(
    `SELECT u.id, u.name, COALESCE(pp.avatar_url, u.image) AS image, pp.date_of_birth, pp.preferred_area, pp.preferred_position
     FROM "user" u LEFT JOIN player_profiles pp ON pp.user_id = u.id WHERE u.id = $1`,
    [input.userId],
  );
  const matchesPlayed = await getMatchesPlayed(input.userId);
  return toProfileDtos(result.rows[0], matchesPlayed);
}
