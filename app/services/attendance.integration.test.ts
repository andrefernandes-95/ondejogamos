import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { Pool } from "pg";
import {
  AttendanceError,
  deleteAttendance,
  registerAttendance,
} from "./attendance";

const databaseUrl = process.env.ATTENDANCE_TEST_DATABASE_URL;
const db = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;
const suffix = randomUUID();
const hostId = `ci-host-${suffix}`;
const playerId = `ci-player-${suffix}`;
const otherId = `ci-other-${suffix}`;
const area = `ci-${suffix}`;
const municipality = `ci-municipality-${suffix}`;
const matchIds: number[] = [];
const matches: Record<string, number> = {};
let pitchId: number | undefined;

async function addMatch(name: string, startsAt: Date, cancelledAt: Date | null = null) {
  if (!db || pitchId === undefined) throw new Error("No test database");
  const { rows } = await db.query<{ id: string }>(
    `
      INSERT INTO matches
        (created_by, pitch_id, format, starts_at, duration_in_minutes, min_attendance, cancelled_at)
      VALUES ($1, $2, '5x5', $3, 60, 10, $4)
      RETURNING id
    `,
    [hostId, pitchId, startsAt, cancelledAt],
  );
  const id = Number(rows[0].id);
  matchIds.push(id);
  matches[name] = id;
}

before(async () => {
  if (!db || !databaseUrl) return;
  const url = new URL(databaseUrl);
  if (
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    !["/ondejogamos_ci", "/ondejogamos_test"].includes(url.pathname)
  ) {
    throw new Error("Attendance integration tests require a disposable localhost test database");
  }

  for (const [id, label] of [
    [hostId, "Host"], [playerId, "Player"], [otherId, "Other"],
  ]) {
    await db.query(
      `INSERT INTO "user" (id, name, email, "emailVerified")
       VALUES ($1, $2, $3, true)`,
      [id, label, `${id}@example.invalid`],
    );
  }
  await db.query(
    "INSERT INTO locations (area, municipality) VALUES ($1, $2)",
    [area, municipality],
  );
  const pitch = await db.query<{ id: string }>(
    "INSERT INTO pitches (area, municipality, name, created_by) VALUES ($1, $2, 'CI Pitch', $3) RETURNING id",
    [area, municipality, hostId],
  );
  pitchId = Number(pitch.rows[0].id);

  const future = new Date(Date.now() + 3_600_000);
  const past = new Date(Date.now() - 3_600_000);
  await addMatch("concurrent", future);
  await addMatch("retry", future);
  await addMatch("past", past);
  await addMatch("cancelled", future, new Date());
  await addMatch("leave", future);
  await addMatch("retain", future);
});

after(async () => {
  if (!db) return;
  try {
    if (matchIds.length) {
      await db.query("DELETE FROM attendance WHERE match_id = ANY($1::bigint[])", [matchIds]);
      await db.query("DELETE FROM matches WHERE id = ANY($1::bigint[])", [matchIds]);
    }
    if (pitchId !== undefined) {
      await db.query("DELETE FROM pitches WHERE id = $1", [pitchId]);
    }
    await db.query("DELETE FROM locations WHERE area = $1 AND municipality = $2", [area, municipality]);
    await db.query('DELETE FROM "user" WHERE id = ANY($1::text[])', [[hostId, playerId, otherId]]);
  } finally {
    await db.end();
  }
});

test("concurrent retries create exactly one registration", { skip: !db }, async () => {
  if (!db) return;
  const results = await Promise.all(
    Array.from({ length: 12 }, () => registerAttendance(matches.concurrent, playerId, db)),
  );
  assert.equal(results.filter((result) => result.created).length, 1);
  assert.equal(new Set(results.map((result) => result.attendance.id)).size, 1);

  const { rows } = await db.query<{ total: number }>(
    "SELECT COUNT(*)::int AS total FROM attendance WHERE match_id = $1 AND user_id = $2",
    [matches.concurrent, playerId],
  );
  assert.equal(rows[0].total, 1);

  const another = await registerAttendance(matches.concurrent, otherId, db);
  assert.equal(another.created, true);
});

test("a retry succeeds after kickoff, but a new player cannot join", { skip: !db }, async () => {
  if (!db) return;
  const first = await registerAttendance(matches.retry, playerId, db);
  assert.equal(first.created, true);

  await db.query("UPDATE matches SET starts_at = NOW() - INTERVAL '1 minute' WHERE id = $1", [
    matches.retry,
  ]);
  const retry = await registerAttendance(matches.retry, playerId, db);
  assert.equal(retry.created, false);
  assert.equal(retry.attendance.id, first.attendance.id);

  await assert.rejects(
    registerAttendance(matches.retry, otherId, db),
    (error: unknown) => error instanceof AttendanceError && error.code === "MATCH_ALREADY_STARTED",
  );
});

test("rejects missing, cancelled, started and owner registrations", { skip: !db }, async () => {
  if (!db) return;
  for (const [matchId, userId, code] of [
    [9999999999, playerId, "MATCH_NOT_FOUND"],
    [matches.past, playerId, "MATCH_ALREADY_STARTED"],
    [matches.cancelled, playerId, "MATCH_CANCELLED"],
    [matches.concurrent, hostId, "FORBIDDEN"],
  ] as const) {
    await assert.rejects(
      registerAttendance(matchId, userId, db),
      (error: unknown) => error instanceof AttendanceError && error.code === code,
    );
  }
});

test("cancellation is idempotent before kickoff", { skip: !db }, async () => {
  if (!db) return;
  await registerAttendance(matches.leave, playerId, db);
  assert.equal(await deleteAttendance(matches.leave, playerId, db), null);
  assert.equal(await deleteAttendance(matches.leave, playerId, db), null);
  const { rows } = await db.query<{ total: number }>(
    "SELECT COUNT(*)::int AS total FROM attendance WHERE match_id = $1 AND user_id = $2",
    [matches.leave, playerId],
  );
  assert.equal(rows[0].total, 0);
});

test("cancellation after kickoff preserves historical attendance", { skip: !db }, async () => {
  if (!db) return;
  await registerAttendance(matches.retain, playerId, db);
  await db.query("UPDATE matches SET starts_at = NOW() - INTERVAL '1 minute' WHERE id = $1", [
    matches.retain,
  ]);
  await assert.rejects(
    deleteAttendance(matches.retain, playerId, db),
    (error: unknown) => error instanceof AttendanceError && error.code === "MATCH_ALREADY_STARTED",
  );
  const { rows } = await db.query<{ total: number }>(
    "SELECT COUNT(*)::int AS total FROM attendance WHERE match_id = $1 AND user_id = $2",
    [matches.retain, playerId],
  );
  assert.equal(rows[0].total, 1);
});
