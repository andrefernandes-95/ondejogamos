import { z } from "zod";

export const profilePreferencesSchema = z.object({
  preferred_area: z.string().trim().min(1).max(100).nullable(),
  preferred_position: z.string().trim().min(1).max(60).nullable(),
}).strict();