export const playerPositions = [
  "goalkeeper",
  "defender",
  "midfielder",
  "forward",
] as const;

export type PlayerPosition = (typeof playerPositions)[number];

export interface PlayerProfilePublicDto {
  id: string;
  name: string;
  image: string | null;
  age: number | null;
  matches_played: number;
  preferred_area: string | null;
  preferred_position: PlayerPosition | null;
}

export interface PlayerProfileEditingPayload extends PlayerProfilePublicDto {
  date_of_birth: string | null;
}
