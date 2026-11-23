import assert from "node:assert/strict";
import test from "node:test";
import { getMatchFormDefaults, toMatchFormData } from "@/app/utils/match-form-data";
import { CreateMatchFormValues } from "@/app/schemas/match";

const validMatch: CreateMatchFormValues = {
  pitchId: "42",
  startsAt: "2026-11-01T18:00:00.000Z",
  format: "5x5",
  minAttendance: 10,
  durationInMinutes: 90,
  description: "Bring a light shirt",
};

test("serializes match fields and includes its ID when editing", () => {
  const formData = toMatchFormData(validMatch, "17");

  assert.equal(formData.get("id"), "17");
  assert.equal(formData.get("pitchId"), "42");
  assert.equal(formData.get("startsAt"), validMatch.startsAt);
  assert.equal(formData.get("durationInMinutes"), "90");
  assert.equal(formData.get("minAttendance"), "10");
});

test("omits the ID for a new match and normalizes optional values", () => {
  const formData = toMatchFormData(
    { ...validMatch, description: undefined, durationInMinutes: undefined },
  );

  assert.equal(formData.has("id"), false);
  assert.equal(formData.get("description"), "");
  assert.equal(formData.get("durationInMinutes"), "60");
});

test("repeating a game copies its settings and requires a fresh date", () => {
  const match = {
    id: "17",
    pitch: { id: 42 },
    starts_at: new Date(validMatch.startsAt),
    format: "7x7" as const,
    description: "Bring a light shirt",
    duration_in_minutes: 90,
    min_attendance: 14,
  };
  const repeated = getMatchFormDefaults({ template: match });
  assert.deepEqual(repeated, { ...validMatch, startsAt: "", format: "7x7", minAttendance: 14 });
  assert.equal(toMatchFormData(repeated).has("id"), false);
  assert.equal(getMatchFormDefaults({ existingMatch: match }).startsAt, validMatch.startsAt);
});
