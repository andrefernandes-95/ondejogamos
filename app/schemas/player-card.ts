import { cardBadges, cardFields } from "@/app/models/player-card";
import { z } from "zod";

export const publicCardId = z.uuid();
export const playerUsername = z.string().trim().toLowerCase()
  .regex(/^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$/);

export const cardSettingsSchema = z.object({
  username: playerUsername.optional(),
  area: z.string().trim().min(1).max(100).nullable(),
  position: z.string().trim().min(1).max(60).nullable(),
  visible: z.array(z.enum(cardFields)).max(cardFields.length)
    .refine((fields) => new Set(fields).size === fields.length),
  badges: z.array(z.enum(cardBadges)).max(cardBadges.length)
    .refine((badges) => new Set(badges).size === badges.length),
  published: z.boolean(),
  photoAction: z.enum(["keep", "remove", "replace"]),
}).strict();

export type CardUpdate = z.infer<typeof cardSettingsSchema>;
