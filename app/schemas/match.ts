import z from "zod";
import { defaultValidationTranslator, type ValidationTranslator } from "@/app/i18n/validation";

export const createMatchSchemaForLocale = (t: ValidationTranslator) => z.object({
  pitchId: z.string(t("Validation.required")).trim().min(1, t("Validation.required")),
  startsAt: z.iso
    .datetime({ offset: true, error: t("Validation.invalidDateTime") })
    .refine(
      (value) => Date.parse(value) > Date.now(),
      t("Validation.futureDate"),
    ),
  format: z.enum(["5x5", "7x7", "11x11"], {
    message: t("Validation.invalidFormat"),
  }),
  minAttendance: z.number(t("Validation.minAttendance")).min(10, t("Validation.minAttendance")),
  durationInMinutes: z.coerce
    .number(t("Validation.durationInteger"))
    .int(t("Validation.durationInteger"))
    .min(30, t("Validation.minDuration"))
    .default(60) as unknown as number,
  description: z.string().trim().nullable().optional(),
});

export const editMatchSchemaForLocale = (t: ValidationTranslator) => createMatchSchemaForLocale(t).extend({
  id: z.string(t("Validation.required")).trim().min(1, t("Validation.required")),
});

export const createMatchSchema = createMatchSchemaForLocale(defaultValidationTranslator);
export const editMatchSchema = editMatchSchemaForLocale(defaultValidationTranslator);

export type CreateMatchFormValues = z.infer<typeof createMatchSchema>;
