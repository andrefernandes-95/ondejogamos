import assert from "node:assert/strict";
import test from "node:test";
import { matchCalendar } from "./match-calendar";

const match = {
  id: "42",
  starts_at: new Date("2026-07-11T23:30:00+01:00"),
  duration_in_minutes: 90,
  pitch: { name: "Campo, Sul;\nPiso 2", municipality: "Chamusca", area: "Santarém" },
};

test("exports UTC times, a stable identifier and the correct canonical match link", () => {
  const event = matchCalendar(match, "Futebol 5x5", new Date("2026-07-01T12:00:00Z"));
  assert.ok(event.includes("DTSTART:20260711T223000Z\r\n"));
  assert.ok(event.includes("DTEND:20260712T000000Z\r\n"));
  assert.ok(event.includes("DTSTAMP:20260701T120000Z\r\n"));
  assert.ok(event.includes("UID:match-42@ondejogamos.com\r\n"));
  assert.ok(event.includes("URL:https://ondejogamos.com/match/42\r\n"));
  assert.ok(event.includes("LOCATION:Campo\\, Sul\\;\\nPiso 2\\, Chamusca\\, Santarém\r\n"));
  assert.ok(event.endsWith("END:VCALENDAR\r\n"));
});

test("folds long UTF-8 lines without breaking accented characters", () => {
  const title = "Futebol à beira-rio · ".repeat(10);
  const event = matchCalendar(match, title);
  assert.ok(event.split("\r\n").every((line) => Buffer.byteLength(line) <= 75));
  assert.ok(event.replace(/\r\n /g, "").includes("SUMMARY:" + title));
});
