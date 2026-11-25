import assert from "node:assert/strict";
import { test } from "node:test";
import { authUrl } from "./auth-return";
import { homeView, matchesPitchSearch, readScheduleSlot } from "./home-schedule";

test("defaults to scheduling and keeps shared agenda filters on the games view", () => {
  assert.equal(homeView(new URLSearchParams()), "schedule");
  assert.equal(homeView(new URLSearchParams("area=Santarém&date=2026-11-28")), "games");
  assert.equal(homeView(new URLSearchParams("view=schedule&area=Santarém")), "schedule");
});

test("matches field names and towns without requiring accents or word order", () => {
  const pitch = { name: "Ringue Municipal", municipality: "Golegã" };
  assert.equal(matchesPitchSearch(pitch, "  GOLEGA ringue "), true);
  assert.equal(matchesPitchSearch(pitch, "ringue cartaxo"), false);
});

test("the authentication return preserves the pitch and converts Lisbon time to UTC", () => {
  const url = new URL(authUrl("/login", "/?view=schedule&schedulePitch=42&scheduleDay=2026-07-04&scheduleTime=18%3A30"), "https://ondejogamos.com");
  const draft = new URL(url.searchParams.get("returnTo")!, url.origin);
  assert.deepEqual(readScheduleSlot(draft.searchParams), {
    pitchId: "42", day: "2026-07-04", time: "18:30", startsAt: "2026-07-04T17:30:00.000Z",
  });
});

test("rejects an invalid pitch, an impossible day and the skipped hour when clocks advance", () => {
  for (const query of [
    "schedulePitch=-2&scheduleDay=2026-03-29&scheduleTime=18:00",
    "schedulePitch=2&scheduleDay=2026-02-30&scheduleTime=18:00",
    "schedulePitch=2&scheduleDay=2026-03-29&scheduleTime=01:30",
  ]) {
    assert.equal(readScheduleSlot(new URLSearchParams(query)), null);
  }
});
