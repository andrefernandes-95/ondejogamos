import { pool } from "@/app/lib/db";
import type { PoolClient } from "pg";

export class UsernameTakenError extends Error {}

export async function ensurePlayerUsername(userId: string) {
  await pool.query("SELECT ensure_player_username($1)", [userId]);
}

export async function claimPlayerUsername(client: PoolClient, userId: string, username: string) {
  const { rowCount } = await client.query(
    `INSERT INTO player_username_claims (username, user_id) VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET user_id = EXCLUDED.user_id
     WHERE player_username_claims.user_id = EXCLUDED.user_id`,
    [username, userId],
  );
  if (rowCount === 0) throw new UsernameTakenError();
}
