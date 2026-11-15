import { pool } from "@/app/lib/db";
import type { CardBadge } from "@/app/models/player-card";
import type { PlayerIdentity } from "@/app/models/player-identity";
import { selectedCardBadges } from "@/app/utils/player-card";
import { earnedCardBadges, founderEligibility } from "./player-card-badges";
import { publicPlayerIdentity } from "./public-player-projection";

export interface Player {
  id: string;
  identity: PlayerIdentity;
  badges: CardBadge[];
  createdAt: string;
  games_created: number;
}

type PlayerRow = Omit<Player, "badges"> & { selectedBadges: CardBadge[] | null; isFounder: boolean };

export async function listUsers(): Promise<Player[]> {
  const { rows } = await pool.query<PlayerRow>(`
            SELECT
                u.id,
                ${publicPlayerIdentity("u", "p")} AS identity,
                CASE WHEN p.published THEN p.selected_badges END AS "selectedBadges",
                ${founderEligibility} AS "isFounder",
                u."createdAt",
                COUNT(m.id)::int AS games_created
            FROM "user" AS u
            LEFT JOIN "matches" AS m ON m.created_by = u.id
            LEFT JOIN player_profiles AS p ON p.user_id = u.id
            GROUP BY u.id, p.user_id
            ORDER BY u."createdAt" DESC
        `);
  return rows.map(({ selectedBadges, isFounder, ...player }) => ({
    ...player,
    badges: selectedCardBadges(selectedBadges, earnedCardBadges(isFounder)),
  }));
}
