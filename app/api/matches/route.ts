import type { ValidationTranslator } from "@/app/i18n/validation";
import { getTranslations } from "next-intl/server";
import auth from "@/app/lib/auth";
import { createMatchSchemaForLocale, editMatchSchemaForLocale } from "@/app/schemas/match";
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

const safeParseCreateFormData = (formData: FormData, t: ValidationTranslator) => {
  return createMatchSchemaForLocale(t).safeParse(getCommonValues(formData));
};
const safeParseUpdateFormData = (formData: FormData, t: ValidationTranslator) => {
  const values = {
    ...getCommonValues(formData),
    id: formData.get("id"),
  };

  return editMatchSchemaForLocale(t).safeParse(values);
};

export async function POST(request: Request) {
  const t = await getTranslations();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: t("Api.signInToSchedule"),
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
        error: t("Api.invalidForm"),
      },
      {
        status: 400,
      },
    );
  }

  const validation = safeParseCreateFormData(formData, t);
  if (!validation.success) {
    return Response.json(
      {
        error: t("Api.invalidData"),
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
    format,
    durationInMinutes,
  } = validation.data;

  const matchInput: SaveMatchInput = {
    pitchId,
    minAttendance,
    description: description!,
    startsAt,
    createdBy: createdBy,
    format,
    durationInMinutes: Number(durationInMinutes) || 60,
  };

  let result: Awaited<ReturnType<typeof saveMatch>>;

  try {
    result = await saveMatch(matchInput);
  } catch (error) {
    console.error(`Falha ao agendar jogo`, error);

    return Response.json(
      {
        error: t("MatchForm.saveError"),
      },
      {
        status: 500,
      },
    );
  }

  return Response.json(result, { status: 200 });
}

export async function PUT(request: Request) {
  const t = await getTranslations();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: t("Api.signInToEdit"),
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
        error: t("Api.invalidForm"),
      },
      {
        status: 400,
      },
    );
  }

  const validation = safeParseUpdateFormData(formData, t);
  if (!validation.success) {
    return Response.json(
      {
        error: t("Api.invalidData"),
        issues: validation.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  console.log("validation:", validation.data);

  const {
    id,
    pitchId,
    minAttendance,
    startsAt,
    description,
    format,
    durationInMinutes,
  } = validation.data;

  const matchInput: UpdateMatchInput = {
    id: Number(id),
    pitchId,
    minAttendance,
    description: description!,
    startsAt,
    createdBy: createdBy,
    format,
    durationInMinutes: Number(durationInMinutes) || 60,
  };

  let result: Awaited<ReturnType<typeof updateMatch>>;

  try {
    result = await updateMatch(matchInput, session.user.id);
  } catch (error) {
    console.error(`Falha ao atualizar jogo`, error);

    return Response.json(
      {
        error: t("MatchForm.updateError"),
      },
      {
        status: 500,
      },
    );
  }

  if (!result) {
    return Response.json(
      {
        error: t("Api.matchNotFound"),
      },
      {
        status: 404,
      },
    );
  }

  return Response.json(result, { status: 201 });
}

export async function DELETE(request: Request) {
  const t = await getTranslations();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: t("Api.signInToDelete"),
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
        error: t("Api.invalidForm"),
      },
      {
        status: 400,
      },
    );
  }

  if (!formData.has("id")) {
    return Response.json(
      {
        error: t("Api.invalidForm"),
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
        error: t("Match.cancelError"),
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
