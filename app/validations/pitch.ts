import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_IN_MB,
} from "@/app/utils/image";
import z from "zod";
import { defaultValidationTranslator, type ValidationTranslator } from "@/app/i18n/validation";

const createPitchSchema = (t: ValidationTranslator) => z.object({
  name: z.string(t("Validation.nameRequired")).trim().min(1, t("Validation.nameRequired")).max(200, t("Validation.maxCharacters", { count: 200 })),
  area: z.string(t("Validation.area")).trim().min(1, t("Validation.area")).max(200, t("Validation.maxCharacters", { count: 200 })),
  municipality: z.string(t("Validation.municipality")).trim().min(1, t("Validation.municipality")).max(200, t("Validation.maxCharacters", { count: 200 })),
  maps_url: z
    .string()
    .trim()
    .refine((value) => {
      if (value === "") {
        return true;
      }

      try {
        return ["http:", "https:"].includes(new URL(value).protocol);
      } catch {
        return false;
      }
    }, t("Validation.mapsUrl")),
  image: z
    .instanceof(File, { message: t("Validation.image") })
    .refine((file) => file.size > 0, t("Validation.emptyImage"))
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      t("Validation.maxImageSize", { count: MAX_IMAGE_SIZE_IN_MB }),
    )
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      t("Validation.imageTypes"),
    ),
});

export const safeParseFormData = (formData: FormData, t: ValidationTranslator = defaultValidationTranslator) =>
  createPitchSchema(t).safeParse({
    name: formData.get("name"),
    area: formData.get("area"),
    municipality: formData.get("municipality"),
    maps_url: formData.get("maps_url") ?? "",
    image: formData.get("image"),
  });
