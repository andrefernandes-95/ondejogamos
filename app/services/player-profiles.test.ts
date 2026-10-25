import assert from "node:assert/strict";
import test from "node:test";
import { isValidBirthDate, playerProfileSchema } from "@/app/validations/player-profile";

test("validates optional birth dates and finite football positions", () => {
  const base = {
    name: "  Alex  ",
    date_of_birth: "2000-02-29",
    preferred_area: "Lisboa",
    preferred_position: "midfielder",
  };
  assert.equal(playerProfileSchema.safeParse(base).success, true);
  assert.equal(playerProfileSchema.safeParse({ ...base, preferred_position: "winger" }).success, false);
  assert.equal(playerProfileSchema.safeParse({ ...base, date_of_birth: "2001-02-29" }).success, false);
  assert.equal(playerProfileSchema.safeParse({ ...base, date_of_birth: "2027-01-01" }).success, false);
  assert.equal(playerProfileSchema.safeParse({ ...base, date_of_birth: "1900-01-01" }).success, false);
  assert.equal(isValidBirthDate("2026-10-25", new Date("2026-10-24T12:00:00Z")), false);
  assert.equal(isValidBirthDate("1900-01-01", new Date("2026-10-24T12:00:00Z")), false);
  assert.equal(isValidBirthDate(null), true);
});
