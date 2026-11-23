import assert from "node:assert/strict";
import test from "node:test";
import { authUrl, safeReturnTo } from "./auth-return";
import { AppRoutes } from "./routes";

test("preserves a shared match link, query and hash", () => {
  assert.equal(
    safeReturnTo("/match/42?source=whatsapp#players"),
    "/match/42?source=whatsapp#players",
  );
});

test("defaults to home for missing or unsafe return paths", () => {
  const unsafePaths = [
    null,
    undefined,
    ["/match/42"],
    "",
    "match/42",
    "https://evil.example/match/42",
    "//evil.example",
    "/..//evil.example",
    "/a/..//evil.example",
    "/%2e%2e//evil.example",
    "/\\evil.example",
    "/match/42\n",
    "javascript:alert(1)",
  ];
  for (const path of unsafePaths) {
    assert.equal(safeReturnTo(path), AppRoutes.HOME);
  }
});

test("keeps the destination through login and signup links", () => {
  const destination = "/match/42?source=whatsapp";
  const login = authUrl(AppRoutes.LOGIN, destination);
  assert.equal(login, "/login?returnTo=%2Fmatch%2F42%3Fsource%3Dwhatsapp");
  assert.equal(
    new URL(login, "https://ondejogamos.com").searchParams.get("returnTo"),
    destination,
  );
  assert.equal(
    authUrl(AppRoutes.SIGN_UP, destination),
    "/signup?returnTo=%2Fmatch%2F42%3Fsource%3Dwhatsapp",
  );
});

test("does not propagate external return destinations", () => {
  assert.equal(authUrl(AppRoutes.LOGIN, "//evil.example"), AppRoutes.LOGIN);
  assert.equal(
    authUrl(AppRoutes.SIGN_UP, "https://evil.example"),
    AppRoutes.SIGN_UP,
  );
});
