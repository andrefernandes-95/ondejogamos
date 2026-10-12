import auth from "@/app/lib/auth";
import { createMatchSchema, editMatchSchema } from "@/app/schemas/match";
import {
  deleteMatch,
  listAllMatches,
  listFullMatches,
  saveMatch,
  SaveMatchInput,
  updateMatch,
  UpdateMatchInput,
} from "@/app/services/matches";

const getCommonValues = (formData: FormData) => ({
  pitchId: formData.get("pitchId"),
  startsAt: formData.get("startsAt"),
  format: formData.get("format"),
  minAttendance: Number(formData.get("minAttendance")),
  durationInMinutes: Number(formData.get("durationInMinutes")),
  description: formData.get("description") ?? "",
});

const safeParseCreateFormData = (formData: FormData) => {
  return createMatchSchema.safeParse(getCommonValues(formData));
};
const safeParseUpdateFormData = (formData: FormData) => {
  const values = {
    ...getCommonValues(formData),
    id: formData.get("id"),
  };

  return editMatchSchema.safeParse(values);
};

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

  const validation = safeParseCreateFormData(formData);
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

  const { pitchId, minAttendance, startsAt, description, format } =
    validation.data;

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

export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: "Inicia a sessão para alterar um jogo",
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

  const validation = safeParseUpdateFormData(formData);
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

  const { id, pitchId, minAttendance, startsAt, description, format } =
    validation.data;

  const matchInput: UpdateMatchInput = {
    id: Number(id),
    pitchId,
    minAttendance,
    description: description!,
    startsAt,
    createdBy: createdBy,
    format,
  };

  let result: Awaited<ReturnType<typeof updateMatch>>;

  try {
    result = await updateMatch(matchInput, session.user.id);
  } catch (error) {
    console.error(`Falha ao atualizar jogo`, error);

    return Response.json(
      {
        error: `Não foi possível atualizar o jogo`,
      },
      {
        status: 500,
      },
    );
  }

  if (!result) {
    return Response.json(
      {
        error: "Jogo não encontrado ou sem permissão para o alterar",
      },
      {
        status: 404,
      },
    );
  }

  return Response.json(result, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: "Inicia a sessão para remover um jogo",
      },
      {
        status: 401,
      },
    );
  }

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

  if (!formData.has("id")) {
    return Response.json(
      {
        error: "Formulário inválido",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await deleteMatch(formData.get("id") as string, session.user.id);
  } catch (error) {
    console.error(`Falha ao remover jogo`, error);

    return Response.json(
      {
        error: `Não foi possível remover o jogo`,
      },
      {
        status: 500,
      },
    );
  }

  return Response.json(true, { status: 201 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const area = url.searchParams.get("area");

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user_id = session?.user.id ?? "";

  const data = area
    ? await listFullMatches(area, user_id)
    : await listAllMatches(user_id);

  return Response.json(data);
}
