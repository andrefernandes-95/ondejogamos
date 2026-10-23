import assert from "node:assert/strict";
import test from "node:test";
import { createMatchSchema } from "@/app/schemas/match";

const validMatch = {
  pitchId: "42",
  startsAt: "2030-11-01T18:00:00.000Z",
  format: "5x5",
  minAttendance: 10,
  durationInMinutes: 90,
  description: "",
};

test("rejects fractional player counts", () => {
  const result = createMatchSchema.safeParse({
    ...validMatch,
    minAttendance: 10.5,
  });

  assert.equal(result.success, false);
});

test("accepts an integer player count", () => {
  const result = createMatchSchema.safeParse(validMatch);

  assert.equal(result.success, true);
});
