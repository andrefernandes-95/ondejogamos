import { playerPositions } from "@/app/models/player-profile";
import { calculateAge, parseDateOnly } from "@/app/utils/date";
import { z } from "zod";

export const playerProfileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  date_of_birth: z
    .string()
    .nullable()
    .refine((value) => value === null || parseDateOnly(value) !== null)
    .refine((value) => isValidBirthDate(value)),
  preferred_area: z.string().trim().max(200).nullable(),
  preferred_position: z.enum(playerPositions).nullable(),
});

export type PlayerProfileInput = z.infer<typeof playerProfileSchema>;

export function isValidBirthDate(value: string | null, today: Date = new Date()): boolean {
  if (value === null) {
    return true;
  }

  const age = calculateAge(value, today);

  return age !== null && age <= 120;
}
