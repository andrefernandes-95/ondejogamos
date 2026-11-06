import assert from "node:assert/strict";
import test from "node:test";
import {
  apiError,
  readApiErrorCode,
  readApiErrorCodeFromResponse,
} from "@/app/utils/api-error";

test("reads a known API error code", () => {
  assert.equal(
    readApiErrorCode({ error: { code: "MATCH_CREATE_FAILED" } }),
    "MATCH_CREATE_FAILED",
  );
});

test("uses the fallback for malformed and unknown API errors", () => {
  assert.equal(readApiErrorCode(null), "INTERNAL_ERROR");
  assert.equal(readApiErrorCode({ error: "unavailable" }), "INTERNAL_ERROR");
  assert.equal(
    readApiErrorCode({ error: { code: "UNRECOGNIZED_CODE" } }),
    "INTERNAL_ERROR",
  );
});

test("creates and reads the shared API error envelope", async () => {
  const response = apiError("INVALID_PITCH_DATA", 400, []);

  assert.equal(response.status, 400);
  assert.equal(await readApiErrorCodeFromResponse(response), "INVALID_PITCH_DATA");
});
