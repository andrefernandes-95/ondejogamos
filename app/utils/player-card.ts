import type { CardBadge, CardContent, PlayerCardEditorData } from "@/app/models/player-card";

export function selectedCardBadges(selected: CardBadge[] | null, earned: CardBadge[]) {
  return selected?.filter((badge) => earned.includes(badge)) ?? [];
}

export function visibleCard(data: Pick<
  PlayerCardEditorData, "settings" | "portrait" | "earned" | "played" | "created"
>): CardContent {
  const { settings, portrait, earned, played, created } = data;
  const fields = settings.visible;
  return {
    name: settings.name,
    badges: selectedCardBadges(settings.badges, earned),
    ...(fields.includes("photo") && portrait ? { photo: portrait } : {}),
    ...(fields.includes("area") && settings.area ? { area: settings.area } : {}),
    ...(fields.includes("position") && settings.position ? { position: settings.position } : {}),
    ...(fields.includes("played") ? { played } : {}),
    ...(fields.includes("created") ? { created } : {}),
  };
}

export function playerCardPath(slug: string) {
  return `/players/${encodeURIComponent(slug)}`;
}
