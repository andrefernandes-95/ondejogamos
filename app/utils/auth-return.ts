import { AppRoutes } from "./routes";

/** Accept only internal paths when returning from authentication. */
export function safeReturnTo(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return AppRoutes.HOME;
  }

  try {
    const url = new URL(value, "https://ondejogamos.com");
    const isInternal =
      url.origin === "https://ondejogamos.com" && !url.pathname.startsWith("//");
    return isInternal
      ? `${url.pathname}${url.search}${url.hash}`
      : AppRoutes.HOME;
  } catch {
    return AppRoutes.HOME;
  }
}

/** Keep the return path when moving between login and signup. */
export function authUrl(route: string, returnTo: string): string {
  const destination = safeReturnTo(returnTo);
  return destination === AppRoutes.HOME
    ? route
    : `${route}?returnTo=${encodeURIComponent(destination)}`;
}
