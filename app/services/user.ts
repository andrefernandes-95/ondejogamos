import { pool } from "@/app/lib/db";
import { User } from "better-auth";

export interface Player {
  id: string;
  name: string;
  createdAt: string;
  games_created: number;
}

export async function listUsers(): Promise<Player[]> {
  const result = await pool.query(`
            SELECT
                u.id,
                u.name,
                u."createdAt",
                COUNT(m.id)::int AS games_created
            FROM "user" AS u
            LEFT JOIN "matches" AS m ON m.created_by = u.id
            GROUP BY u.id
            ORDER BY u."createdAt" DESC
        `);
  return result.rows;
}
