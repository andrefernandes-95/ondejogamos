import auth from "@/app/lib/auth";
import {
  deleteAttendance,
  listAttendancesForMatch,
  registerAttendance,
} from "@/app/services/attendance";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: "Inicia a sessão para participar num jogo",
      },
      {
        status: 401,
      },
    );
  }

  const user_id = session.user.id;

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

  const match_id = Number(formData.get("match_id"));
  if (!match_id) {
    return Response.json(
      {
        error: "Dados inválidos",
      },
      {
        status: 400,
      },
    );
  }

  let result: Awaited<ReturnType<typeof registerAttendance>>;

  try {
    result = await registerAttendance(match_id, user_id);
  } catch (error) {
    console.error(`Falha ao registar presença`, error);

    return Response.json(
      {
        error: `Não foi possível registar presença`,
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
  const match_id = url.searchParams.get("match_id");

  if (!match_id) {
    return Response.json(
      { error: "O ID do jogo é obrigatório" },
      { status: 400 },
    );
  }

  const data = await listAttendancesForMatch(Number(match_id));
  return Response.json(data);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: "Inicia a sessão para participar num jogo",
      },
      {
        status: 401,
      },
    );
  }

  const user_id = session.user.id;

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

  const match_id = Number(formData.get("match_id"));
  if (!match_id) {
    return Response.json(
      {
        error: "Dados inválidos",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await deleteAttendance(match_id, user_id);
  } catch (error) {
    console.error(`Falha ao apagar presença`, error);

    return Response.json(
      {
        error: `Não foi possível apagar presença`,
      },
      {
        status: 500,
      },
    );
  }

  return Response.json(true, { status: 200 });
}
