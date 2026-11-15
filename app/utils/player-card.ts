import type { CardContent, PlayerCardEditorData } from "@/app/models/player-card";

export function visibleCard(data: Pick<
  PlayerCardEditorData, "name" | "settings" | "portrait" | "earned" | "played" | "created"
>): CardContent {
  const { settings, name, portrait, earned, played, created } = data;
  const fields = settings.visible;
  return {
    name,
    badges: settings.badges.filter((badge) => earned.includes(badge)),
    ...(fields.includes("photo") && portrait ? { photo: portrait } : {}),
    ...(fields.includes("area") && settings.area ? { area: settings.area } : {}),
    ...(fields.includes("position") && settings.position ? { position: settings.position } : {}),
    ...(fields.includes("played") ? { played } : {}),
    ...(fields.includes("created") ? { created } : {}),
  };
}

export function playerCardPath(id: string) {
  return `/players/${id}`;
}
