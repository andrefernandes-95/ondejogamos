import { pool } from "@/app/lib/db";
import { defaultCardFields } from "@/app/models/player-card";
import type { CardBadge, CardField } from "@/app/models/player-card";
import { publicCardId } from "@/app/schemas/player-card";
import { visibleCard, playerCardPath } from "@/app/utils/player-card";
import { getCardStats } from "./card-stats";

interface CardRow {
  user_id: string;
  name: string;
  public_id: string | null;
  preferred_area: string | null;
  preferred_position: string | null;
  avatar_storage_key: string | null;
  visible_fields: CardField[] | null;
  selected_badges: CardBadge[] | null;
  published: boolean | null;
  is_founder: boolean;
}

const selectCard = `
  SELECT u.id AS user_id, u.name, p.public_id, p.preferred_area, p.preferred_position,
         p.avatar_storage_key, p.visible_fields, p.selected_badges, p.published,
         u."createdAt" < TIMESTAMPTZ '2027-01-01 00:00:00 Europe/Lisbon' AS is_founder
  FROM "user" u LEFT JOIN player_profiles p ON p.user_id = u.id`;

export async function findOwnerCard(userId: string) {
  const { rows } = await pool.query<CardRow>(`${selectCard} WHERE u.id = $1`, [userId]);
  return rows[0] ?? null;
}

export async function findPublicCard(id: string) {
  if (!publicCardId.safeParse(id).success) return null;
  const { rows } = await pool.query<CardRow>(
    `${selectCard} WHERE p.public_id = $1 AND p.published`,
    [id],
  );
  return rows[0] ?? null;
}

export async function cardData(row: CardRow, portrait: string | null) {
  const earned: CardBadge[] = row.is_founder ? ["founder"] : [];
  return {
    name: row.name,
    publicId: row.public_id,
    earned,
    portrait,
    ...(await getCardStats(row.user_id)),
    settings: {
      area: row.preferred_area,
      position: row.preferred_position,
      visible: row.visible_fields ?? defaultCardFields,
      badges: row.selected_badges?.filter((badge) => earned.includes(badge)) ?? [],
      published: row.published ?? false,
    },
  };
}

export async function getPublicCard(id: string) {
  const row = await findPublicCard(id);
  if (!row) return null;
  const portrait = row.avatar_storage_key ? `${playerCardPath(id)}/portrait` : null;
  return visibleCard(await cardData(row, portrait));
}
