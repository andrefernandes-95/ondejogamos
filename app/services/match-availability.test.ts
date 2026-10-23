import assert from "node:assert/strict";
import test from "node:test";
import { matchTimeRangesOverlap } from "@/app/utils/match-time";

const start = new Date("2030-11-01T18:00:00.000Z");

test("detects partial overlap in either order", () => {
  const first = { startsAt: start, durationInMinutes: 60 };
  const second = {
    startsAt: new Date(start.getTime() + 30 * 60_000),
    durationInMinutes: 60,
  };

  assert.equal(matchTimeRangesOverlap(first, second), true);
  assert.equal(matchTimeRangesOverlap(second, first), true);
});

test("detects a range contained inside another", () => {
  const first = { startsAt: start, durationInMinutes: 120 };
  const second = {
    startsAt: new Date(start.getTime() + 30 * 60_000),
    durationInMinutes: 30,
  };

  assert.equal(matchTimeRangesOverlap(first, second), true);
  assert.equal(matchTimeRangesOverlap(second, first), true);
});

test("allows matches whose start and end times touch", () => {
  const first = { startsAt: start, durationInMinutes: 60 };
  const second = {
    startsAt: new Date(start.getTime() + 60 * 60_000),
    durationInMinutes: 60,
  };

  assert.equal(matchTimeRangesOverlap(first, second), false);
});

test("allows a match that ends before another starts", () => {
  const first = { startsAt: start, durationInMinutes: 30 };
  const second = {
    startsAt: new Date(start.getTime() + 31 * 60_000),
    durationInMinutes: 60,
  };

  assert.equal(matchTimeRangesOverlap(first, second), false);
});
