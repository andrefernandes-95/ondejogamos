import auth from "@/app/lib/auth";
import {
  deleteAttendance,
  listAttendancesForMatch,
  registerAttendance,
} from "@/app/services/attendance";
import { apiError } from "@/app/utils/api-error";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return apiError("AUTHENTICATION_REQUIRED", 401);
  }

  const user_id = session.user.id;

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return apiError("INVALID_FORM", 400);
  }

  const match_id = Number(formData.get("match_id"));
  if (!Number.isInteger(match_id) || match_id < 1) {
    return apiError("INVALID_ATTENDANCE_DATA", 400);
  }

  let result: Awaited<ReturnType<typeof registerAttendance>>;

  try {
    result = await registerAttendance(match_id, user_id);
  } catch (error) {
    console.error(`Falha ao registar presença`, error);

    return apiError("ATTENDANCE_CREATE_FAILED", 500);
  }

  return Response.json(result, { status: 201 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const match_id = url.searchParams.get("match_id");

  const parsedMatchId = Number(match_id);
  if (!Number.isInteger(parsedMatchId) || parsedMatchId < 1) {
    return apiError("INVALID_QUERY", 400);
  }

  try {
    const data = await listAttendancesForMatch(parsedMatchId);
    return Response.json(data);
  } catch (error) {
    console.error("Falha ao carregar presenças", error);
    return apiError("ATTENDANCE_READ_FAILED", 500);
  }
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return apiError("AUTHENTICATION_REQUIRED", 401);
  }

  const user_id = session.user.id;

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return apiError("INVALID_FORM", 400);
  }

  const match_id = Number(formData.get("match_id"));
  if (!Number.isInteger(match_id) || match_id < 1) {
    return apiError("INVALID_ATTENDANCE_DATA", 400);
  }

  try {
    await deleteAttendance(match_id, user_id);
  } catch (error) {
    console.error(`Falha ao apagar presença`, error);

    return apiError("ATTENDANCE_DELETE_FAILED", 500);
  }

  return Response.json(true, { status: 200 });
}
