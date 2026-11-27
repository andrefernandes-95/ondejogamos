import assert from "node:assert/strict";
import { test } from "node:test";
import { availablePitchTimes, scheduleCandidates } from "./pitch-slots";

test("blocks overlapping evening times and permits adjacent games", () => {
  const candidates = scheduleCandidates("2026-11-28", Date.parse("2026-11-28T16:59:00Z"));
  const occupied = [{ starts_at: "2026-11-28T18:00:00Z", duration_in_minutes: 60 }];
  const free = availablePitchTimes(candidates, occupied, 60);
  assert.ok(free.includes("17:00"));
  assert.ok(free.includes("19:00"));
  assert.ok(!free.includes("17:30"));
  assert.ok(!free.includes("18:00"));
  assert.ok(!free.includes("16:30"));
  assert.ok(!availablePitchTimes(candidates, occupied, 90).includes("17:00"));
});

test("blocks a late game if it overlaps a game on the following day", () => {
  const candidates = scheduleCandidates("2026-11-28", Date.parse("2026-11-28T22:00:00Z"));
  const occupied = [{ starts_at: "2026-11-29T00:00:00Z", duration_in_minutes: 60 }];
  assert.deepEqual(availablePitchTimes(candidates, occupied, 60), ["22:30", "23:00"]);
});
