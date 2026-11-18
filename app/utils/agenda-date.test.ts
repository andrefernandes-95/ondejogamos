import assert from "node:assert/strict";
import test from "node:test";
import { agendaDay, agendaWeek, shiftAgendaDay, validAgendaDay } from "./agenda-date";

test("groups games by the Lisbon date at the summer midnight boundary", () => {
  assert.equal(agendaDay("2026-07-01T22:59:00Z"), "2026-07-01");
  assert.equal(agendaDay("2026-07-01T23:00:00Z"), "2026-07-02");
});

test("a Sunday ends the Monday-first agenda even across New Year", () => {
  const week = agendaWeek("2027-01-03");
  assert.equal(week[0], "2026-12-28");
  assert.equal(week[6], "2027-01-03");
  assert.equal(shiftAgendaDay(week[0], 7), "2027-01-04");
});

test("URL day selection accepts only real calendar dates", () => {
  assert.equal(validAgendaDay("2028-02-29"), true);
  assert.equal(validAgendaDay("2027-02-29"), false);
  assert.equal(validAgendaDay("2026-11-18T00:00:00Z"), false);
  assert.equal(validAgendaDay(null), false);
});
