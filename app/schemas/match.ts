import z from "zod";

export const createMatchSchema = z.object({
  pitchId: z.string("Campo obrigatório").trim().min(1, "Campo obrigatório"),
  startsAt: z.iso
    .datetime({ offset: true, error: "Data e hora inválidas" })
    .refine(
      (value) => Date.parse(value) > Date.now(),
      "Escolhe uma data e uma hora no futuro",
    ),
  format: z.enum(["5x5", "7x7", "11x11"], {
    message: "Formato inválido",
  }),
  minAttendance: z
    .number()
    .int("O número de jogadores deve ser inteiro")
    .min(10, "Introduz um número mínimo de jogadores"),
  durationInMinutes: z.coerce
    .number()
    .int("A duração deve ser um número inteiro")
    .min(30, "Introduz a duração em minutos")
    .default(60) as unknown as number,
  description: z.string().trim().nullable().optional(),
});

export const editMatchSchema = createMatchSchema.extend({
  id: z.string("Campo obrigatório").trim().min(1, "Campo obrigatório"),
});

export type CreateMatchFormValues = z.infer<typeof createMatchSchema>;
