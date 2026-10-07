import auth from "@/app/lib/auth";
import { createMatchSchema } from "@/app/schemas/match";
import { listMatches, saveMatch, SaveMatchInput } from "@/app/services/matches";

const safeParseFormData = (formData: FormData) =>
  createMatchSchema.safeParse({
    pitchId: formData.get("pitchId"),
    startsAt: formData.get("startsAt"),
    format: formData.get("format"),
    minAttendance: Number(formData.get("minAttendance")),
    durationInMinutes: Number(formData.get("durationInMinutes")),
    description: formData.get("description") ?? "",
  });

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: "Inicia a sessão para agendar um jogo",
      },
      {
        status: 401,
      },
    );
  }

  const createdBy = session.user.id;

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      {
        error: "Formulário inválido",
      },
      {
        status: 400,
      },
    );
  }

  const validation = safeParseFormData(formData);
  if (!validation.success) {
    return Response.json(
      {
        error: "Dados inválidos",
        issues: validation.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  const {
    pitchId,
    minAttendance,
    startsAt,
    description,
    durationInMinutes,
    format,
  } = validation.data;

  const matchInput: SaveMatchInput = {
    pitchId,
    minAttendance,
    description: description!,
    startsAt,
    createdBy: createdBy,
    format,
  };

  let result: Awaited<ReturnType<typeof saveMatch>>;

  try {
    result = await saveMatch(matchInput);
  } catch (error) {
    console.error(`Falha ao agendar jogo`, error);

    return Response.json(
      {
        error: `Não foi possível agendar o jogo`,
      },
      {
        status: 500,
      },
    );
  }

  return Response.json(result, { status: 200 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const area = url.searchParams.get("area");

  if (!area) {
    return Response.json({ error: "A área é obrigatória" }, { status: 400 });
  }

  const data = await listMatches(area);
  return Response.json(data);
}
