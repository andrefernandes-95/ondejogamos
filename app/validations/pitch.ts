import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_IN_MB,
} from "@/app/utils/image";
import z from "zod";

const pitchSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(200),
  area: z.string().trim().min(1, "Área obrigatória").max(200),
  municipality: z.string().trim().min(1, "Município obrigatório").max(200),
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
    }, "URL do mapa inválido"),
  image: z
    .instanceof(File, { message: "Imagem obrigatória" })
    .refine((file) => file.size > 0, "A imagem está vazia")
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      `A imagem não pode exceder ${MAX_IMAGE_SIZE_IN_MB} MB`,
    )
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      "Usa uma imagem JPEG, PNG ou WEBP",
    ),
});

export const safeParseFormData = (formData: FormData) =>
  pitchSchema.safeParse({
    name: formData.get("name"),
    area: formData.get("area"),
    municipality: formData.get("municipality"),
    maps_url: formData.get("maps_url") ?? "",
    image: formData.get("image"),
  });
