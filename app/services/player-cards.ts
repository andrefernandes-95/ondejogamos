import { pool } from "@/app/lib/db";
import { defaultCardFields } from "@/app/models/player-card";
import type { CardBadge, CardField } from "@/app/models/player-card";
import { playerUsername, publicCardId } from "@/app/schemas/player-card";
import { visibleCard, playerCardPath, selectedCardBadges } from "@/app/utils/player-card";
import { getCardStats } from "./card-stats";
import { earnedCardBadges, founderEligibility } from "./player-card-badges";

interface CardRow {
  user_id: string;
  name: string;
  username: string | null;
  preferred_area: string | null;
  preferred_position: string | null;
  avatar_storage_key: string | null;
  visible_fields: CardField[] | null;
  selected_badges: CardBadge[] | null;
  published: boolean | null;
  is_founder: boolean;
}

const selectCard = `
  SELECT u.id AS user_id, u.name, p.username, p.preferred_area, p.preferred_position,
         p.avatar_storage_key, p.visible_fields, p.selected_badges, p.published,
         ${founderEligibility} AS is_founder
  FROM "user" u LEFT JOIN player_profiles p ON p.user_id = u.id`;

export async function findOwnerCard(userId: string) {
  const { rows } = await pool.query<CardRow>(`${selectCard} WHERE u.id = $1`, [userId]);
  return rows[0] ?? null;
}

export async function findPublicCard(identifier: string) {
  const legacyId = publicCardId.safeParse(identifier);
  const username = playerUsername.safeParse(identifier);
  if (!legacyId.success && !username.success) return null;
  const column = legacyId.success ? "p.public_id" : "p.username";
  const { rows } = await pool.query<CardRow>(
    `${selectCard} WHERE ${column} = $1 AND p.published`,
    [legacyId.success ? legacyId.data : username.data],
  );
  return rows[0] ?? null;
}

export async function cardData(row: CardRow, portrait: string | null) {
  const earned = earnedCardBadges(row.is_founder);
  return {
    earned,
    portrait,
    ...(await getCardStats(row.user_id)),
    settings: {
      name: row.name,
      username: row.username ?? "",
      area: row.preferred_area,
      position: row.preferred_position,
      visible: row.visible_fields ?? defaultCardFields,
      badges: selectedCardBadges(row.selected_badges, earned),
      published: row.published ?? false,
    },
  };
}

export async function getPublicCard(identifier: string) {
  const row = await findPublicCard(identifier);
  if (!row?.username) return null;
  const portrait = row.avatar_storage_key ? `${playerCardPath(row.username)}/portrait` : null;
  return { username: row.username, card: visibleCard(await cardData(row, portrait)) };
}
