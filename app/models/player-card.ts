export const cardFields = ["photo", "position", "area", "played", "created"] as const;
export type CardField = (typeof cardFields)[number];
export const defaultCardFields: CardField[] = ["position", "area", "played"];

export const cardBadges = ["founder"] as const;
export type CardBadge = (typeof cardBadges)[number];

export interface CardSettings {
  area: string | null;
  position: string | null;
  visible: CardField[];
  badges: CardBadge[];
  published: boolean;
}

export interface CardContent {
  name: string;
  photo?: string;
  area?: string;
  position?: string;
  played?: number;
  created?: number;
  badges: CardBadge[];
}

export interface PlayerCardEditorData {
  settings: CardSettings;
  publicId: string | null;
  name: string;
  portrait: string | null;
  earned: CardBadge[];
  played: number;
  created: number;
  areas: string[];
}
