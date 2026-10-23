import assert from "node:assert/strict";
import test from "node:test";
import { toMatchFormData } from "@/app/utils/match-form-data";
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
