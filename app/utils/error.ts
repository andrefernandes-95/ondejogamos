"use client";
export const ErrorCode = {
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
};

export const getErrorMessage = (
  errorCode: string,
  isEnglish: boolean,
): string => {
  const error = errorCode as keyof typeof ErrorCode;

  if (error === "SESSION_NOT_FOUND") {
    return isEnglish ? "Session not found" : "Sessão não encontrada";
  }

  return isEnglish ? "An error occurred" : "Um erro ocorreu";
};
