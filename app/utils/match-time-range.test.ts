import assert from "node:assert/strict";
import test from "node:test";
import { matchSlotsOverlap } from "./match-time-range";

test("back-to-back matches are allowed across midnight", () => {
  const first = { startsAt: "2026-12-02T23:30:00Z", durationInMinutes: 45 };
  const second = { startsAt: "2026-12-03T00:15:00Z", durationInMinutes: 60 };
  assert.equal(matchSlotsOverlap(first, second), false);
  assert.equal(matchSlotsOverlap(second, first), false);
});

test("a partial overlap is detected even off the 30-minute grid", () => {
  const first = { startsAt: "2026-12-02T23:30:00Z", durationInMinutes: 45 };
  const second = { startsAt: "2026-12-03T00:00:00Z", durationInMinutes: 60 };
  assert.equal(matchSlotsOverlap(first, second), true);
  assert.equal(matchSlotsOverlap(second, first), true);
  assert.equal(matchSlotsOverlap(first, { ...second, durationInMinutes: 0 }), false);
});
