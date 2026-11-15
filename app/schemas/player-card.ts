import { cardBadges, cardFields } from "@/app/models/player-card";
import { z } from "zod";

export const publicCardId = z.uuid();
export const playerName = z.string().trim().min(1).max(100);
export const playerSlug = z.string().trim().toLowerCase().max(60)
  .regex(/^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/);

export const cardSettingsSchema = z.object({
  name: playerName.optional(),
  area: z.string().trim().min(1).max(100).nullable(),
  position: z.string().trim().min(1).max(60).nullable(),
  visible: z.array(z.enum(cardFields)).max(cardFields.length)
    .refine((fields) => new Set(fields).size === fields.length),
  badges: z.array(z.enum(cardBadges)).max(cardBadges.length)
    .refine((badges) => new Set(badges).size === badges.length),
  photoAction: z.enum(["keep", "remove", "replace"]),
  // Accept the fields sent by the previous editor during rollout.
  username: z.string().optional(),
  published: z.boolean().optional(),
}).strict();

export type CardUpdate = z.infer<typeof cardSettingsSchema>;
