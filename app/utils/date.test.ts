import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateAge,
  parseDateOnly,
  toDateOnly,
} from "@/app/utils/date";

test("parses and formats date-only values strictly", () => {
  assert.equal(toDateOnly(parseDateOnly("2000-02-29")), "2000-02-29");
  assert.equal(parseDateOnly("2001-02-29"), null);
  assert.equal(parseDateOnly("29-02-2000"), null);
  assert.equal(toDateOnly("2001-02-29"), null);
});

test("calculates age at the birthday boundary", () => {
  const today = new Date("2026-10-24T12:00:00Z");

  assert.equal(calculateAge("2000-10-24", today), 26);
  assert.equal(calculateAge("2000-10-25", today), 25);
  assert.equal(calculateAge("2027-01-01", today), null);
});
