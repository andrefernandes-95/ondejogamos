import assert from "node:assert/strict";
import test from "node:test";
import { parseAttendanceMatchId } from "./attendance-match-id";

test("accepts positive decimal match IDs", () => {
  assert.equal(parseAttendanceMatchId("1"), 1);
  assert.equal(parseAttendanceMatchId("234"), 234);
});

test("rejects missing, ambiguous or unsafe match IDs", () => {
  for (const value of [
    null, undefined, 12, new File(["x"], "id.txt"), "", "0", "-1",
    "01", "1.0", "1e2", " 1", "1 ", "Infinity",
    "9007199254740992", "NaN",
  ]) {
    assert.equal(parseAttendanceMatchId(value), null);
  }
});
