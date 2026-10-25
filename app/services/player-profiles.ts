import { pool } from "@/app/lib/db";
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

function toProfileDtos(row: ProfileRow): {
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
    `SELECT u.id, u.name, u.image, pp.date_of_birth, pp.preferred_area, pp.preferred_position
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
  return toProfileDtos(row);
}

export async function savePlayerProfile(input: {
  userId: string;
  name: string;
  date_of_birth: string | null;
  preferred_area: string | null;
  preferred_position: PlayerPosition | null;
}): Promise<{ publicProfile: PlayerProfilePublicDto; editingProfile: PlayerProfileEditingPayload }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`UPDATE "user" SET name = $1, "updatedAt" = NOW() WHERE id = $2`, [input.name, input.userId]);
    await client.query(
      `INSERT INTO player_profiles (user_id, date_of_birth, preferred_area, preferred_position)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         date_of_birth = EXCLUDED.date_of_birth,
         preferred_area = EXCLUDED.preferred_area,
         preferred_position = EXCLUDED.preferred_position,
         updated_at = NOW()`,
      [input.userId, input.date_of_birth, input.preferred_area, input.preferred_position],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const result = await pool.query<ProfileRow>(
    `SELECT u.id, u.name, u.image, pp.date_of_birth, pp.preferred_area, pp.preferred_position
     FROM "user" u LEFT JOIN player_profiles pp ON pp.user_id = u.id WHERE u.id = $1`,
    [input.userId],
  );
  return toProfileDtos(result.rows[0]);
}
