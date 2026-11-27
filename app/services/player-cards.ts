import { pool } from "@/app/lib/db";
import { defaultCardFields } from "@/app/models/player-card";
import type { CardBadge, CardContent, CardField } from "@/app/models/player-card";
import { playerSlug, publicCardId } from "@/app/schemas/player-card";
import { visibleCard, playerCardPath, selectedCardBadges } from "@/app/utils/player-card";
import { getCardStatsForUsers } from "./card-stats";
import { earnedCardBadges, founderEligibility } from "./player-card-badges";

interface CardRow {
  user_id: string;
  name: string;
  public_slug: string;
  preferred_area: string | null;
  preferred_position: string | null;
  avatar_storage_key: string | null;
  visible_fields: CardField[] | null;
  selected_badges: CardBadge[] | null;
  is_founder: boolean;
}

const selectCard = `
  SELECT u.id AS user_id, u.name, p.public_slug, p.preferred_area, p.preferred_position,
         p.avatar_storage_key, p.visible_fields, p.selected_badges,
         ${founderEligibility()} AS is_founder
  FROM "user" u JOIN player_profiles p ON p.user_id = u.id`;

export async function findOwnerCard(userId: string) {
  const { rows } = await pool.query<CardRow>(`${selectCard} WHERE u.id = $1`, [userId]);
  return rows[0] ?? null;
}

export async function findPublicCard(identifier: string) {
  const legacyId = publicCardId.safeParse(identifier);
  const slug = playerSlug.safeParse(identifier);
  if (!legacyId.success && !slug.success) return null;
  const condition = legacyId.success ? "p.public_id = $1" : `p.user_id = (
    SELECT user_id FROM player_username_claims WHERE username = $1 AND redirect_enabled
  )`;
  const { rows } = await pool.query<CardRow>(
    `${selectCard} WHERE ${condition}`,
    [legacyId.success ? legacyId.data : slug.data],
  );
  return rows[0] ?? null;
}

function cardDataWithStats(row: CardRow, portrait: string | null, stats = { played: 0, created: 0 }) {
  const earned = earnedCardBadges(row.is_founder);
  return {
    slug: row.public_slug,
    earned,
    portrait,
    ...stats,
    settings: {
      name: row.name,
      area: row.preferred_area,
      position: row.preferred_position,
      visible: row.visible_fields ?? defaultCardFields,
      badges: selectedCardBadges(row.selected_badges, earned),
    },
  };
}

export async function cardData(row: CardRow, portrait: string | null) {
  const stats = await getCardStatsForUsers([row.user_id]);
  return cardDataWithStats(row, portrait, stats.get(row.user_id));
}

function publicCardContent(row: CardRow, stats: { played: number; created: number } | undefined) {
  const portrait = row.avatar_storage_key ? `${playerCardPath(row.public_slug)}/portrait` : null;
  return visibleCard(cardDataWithStats(row, portrait, stats));
}

export async function getPublicCard(identifier: string) {
  const row = await findPublicCard(identifier);
  if (!row) {
    return null;
  }
  const stats = await getCardStatsForUsers([row.user_id]);
  return { slug: row.public_slug, card: publicCardContent(row, stats.get(row.user_id)) };
}

export async function getPublicCardsBySlug(slugs: string[], db = pool): Promise<Map<string, CardContent>> {
  if (!slugs.length) {
    return new Map();
  }
  const { rows } = await db.query<CardRow>(
    `${selectCard} WHERE p.public_slug = ANY($1::text[])`,
    [slugs],
  );
  const stats = await getCardStatsForUsers(rows.map((row) => row.user_id), db);
  return new Map(rows.map((row) => [row.public_slug, publicCardContent(row, stats.get(row.user_id))]));
}
