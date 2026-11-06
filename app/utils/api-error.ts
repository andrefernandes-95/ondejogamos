export const API_ERROR_CODES = [
  "AUTHENTICATION_REQUIRED",
  "FORBIDDEN",
  "AREA_REQUIRED",
  "INVALID_FORM",
  "INVALID_QUERY",
  "INVALID_MATCH_DATA",
  "MATCH_CREATE_FAILED",
  "MATCH_UPDATE_FAILED",
  "MATCH_DELETE_FAILED",
  "MATCH_NOT_FOUND",
  "MATCH_READ_FAILED",
  "INVALID_PITCH_DATA",
  "PITCH_CREATE_FAILED",
  "PITCH_UPDATE_FAILED",
  "PITCH_DELETE_FAILED",
  "PITCH_NOT_FOUND",
  "PITCH_HAS_ACTIVE_MATCHES",
  "PITCH_READ_FAILED",
  "STORAGE_NOT_CONFIGURED",
  "IMAGE_UPLOAD_FAILED",
  "INVALID_ATTENDANCE_DATA",
  "ATTENDANCE_CREATE_FAILED",
  "ATTENDANCE_DELETE_FAILED",
  "ATTENDANCE_READ_FAILED",
  "AVAILABILITY_READ_FAILED",
  "LOCATION_READ_FAILED",
  "PROFILE_READ_FAILED",
  "INTERNAL_ERROR",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export function readApiErrorCode(payload: unknown): ApiErrorCode {
  if (typeof payload !== "object" || payload === null || !("error" in payload)) {
    return "INTERNAL_ERROR";
  }

  const error = payload.error;
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return "INTERNAL_ERROR";
  }

  return typeof error.code === "string" && API_ERROR_CODES.includes(error.code as ApiErrorCode)
    ? (error.code as ApiErrorCode)
    : "INTERNAL_ERROR";
}

export async function readApiErrorCodeFromResponse(
  response: Response,
): Promise<ApiErrorCode> {
  const payload: unknown = await response.json().catch(() => null);
  return readApiErrorCode(payload);
}

export function apiError(code: ApiErrorCode, status: number, details?: unknown) {
  return Response.json(
    { error: { code, ...(details === undefined ? {} : { details }) } },
    { status },
  );
}
