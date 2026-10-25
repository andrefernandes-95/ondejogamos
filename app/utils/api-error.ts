export type ApiErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "INVALID_FORM"
  | "INVALID_MATCH_DATA"
  | "MATCH_CREATE_FAILED"
  | "MATCH_UPDATE_FAILED"
  | "MATCH_DELETE_FAILED"
  | "MATCH_NOT_FOUND"
  | "MATCH_TIME_CONFLICT"
  | "PLAYER_PROFILE_INVALID"
  | "PLAYER_PROFILE_UPDATE_FAILED"
  | "INTERNAL_ERROR";

const apiErrorCodes: ApiErrorCode[] = [
  "AUTHENTICATION_REQUIRED",
  "INVALID_FORM",
  "INVALID_MATCH_DATA",
  "MATCH_CREATE_FAILED",
  "MATCH_UPDATE_FAILED",
  "MATCH_DELETE_FAILED",
  "MATCH_NOT_FOUND",
  "MATCH_TIME_CONFLICT",
  "PLAYER_PROFILE_INVALID",
  "PLAYER_PROFILE_UPDATE_FAILED",
  "INTERNAL_ERROR",
];

export function readApiErrorCode(payload: unknown): ApiErrorCode {
  if (typeof payload !== "object" || payload === null || !("error" in payload)) {
    return "INTERNAL_ERROR";
  }

  const error = payload.error;
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return "INTERNAL_ERROR";
  }

  return typeof error.code === "string" && apiErrorCodes.includes(error.code as ApiErrorCode)
    ? (error.code as ApiErrorCode)
    : "INTERNAL_ERROR";
}

export function apiError(code: ApiErrorCode, status: number, details?: unknown) {
  return Response.json(
    { error: { code, ...(details ? { details } : {}) } },
    { status },
  );
}
