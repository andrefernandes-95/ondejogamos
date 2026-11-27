import { pool } from "@/app/lib/db";
import type { PlayerIdentity } from "@/app/models/player-identity";
import { publicPlayerIdentity } from "./public-player-projection";

export interface Player {
  id: string;
  identity: PlayerIdentity;
  createdAt: string;
  games_created: number;
}

export async function listUsers(): Promise<Player[]> {
  const { rows } = await pool.query<Player>(`
            SELECT
                u.id,
                ${publicPlayerIdentity("u", "p")} AS identity,
                u."createdAt",
                COUNT(m.id)::int AS games_created
            FROM "user" AS u
            LEFT JOIN "matches" AS m ON m.created_by = u.id AND m.cancelled_at IS NULL
            LEFT JOIN player_profiles AS p ON p.user_id = u.id
            GROUP BY u.id, p.user_id
            ORDER BY u."createdAt" DESC
        `);
  return rows;
}
