import auth from "@/app/lib/auth";
import {
  deleteAttendance,
  listAttendancesForMatch,
  registerAttendance,
} from "@/app/services/attendance";
import { apiError } from "@/app/utils/api-error";
import { parseAttendanceMatchId } from "@/app/utils/attendance-match-id";
import { AttendanceError } from "@/app/services/attendance";

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

  const match_id = parseAttendanceMatchId(formData.get("match_id"));
  if (match_id === null) {
    return apiError("INVALID_ATTENDANCE_DATA", 400);
  }

  try {
    const result = await registerAttendance(match_id, user_id);
    return Response.json(result.attendance, { status: result.created ? 201 : 200 });
  } catch (error) {
    if (error instanceof AttendanceError) {
      return apiError(error.code, error.status);
    }
    console.error("Falha ao registar presença", error);
    return apiError("ATTENDANCE_CREATE_FAILED", 500);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const match_id = url.searchParams.get("match_id");

  const parsedMatchId = parseAttendanceMatchId(match_id);
  if (parsedMatchId === null) {
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

  const match_id = parseAttendanceMatchId(formData.get("match_id"));
  if (match_id === null) {
    return apiError("INVALID_ATTENDANCE_DATA", 400);
  }

  try {
    await deleteAttendance(match_id, user_id);
  } catch (error) {
    if (error instanceof AttendanceError) {
      return apiError(error.code, error.status);
    }
    console.error("Falha ao apagar presença", error);
    return apiError("ATTENDANCE_DELETE_FAILED", 500);
  }

  return Response.json(true, { status: 200 });
}
