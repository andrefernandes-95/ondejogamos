import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { Pool } from "pg";
import {
  AttendanceError,
  deleteAttendance,
  listAttendancesForMatch,
  registerAttendance,
} from "./attendance";
import { cancelMatch } from "./cancel-match";
import { getFullMatchById, listFullMatches } from "./full-matches";
import { getPitchMatchesForDateInterval } from "./pitch-availability";
import { confirmMatchPlayed } from "./confirm-match-played";
import { MatchScheduleError, saveMatch, updateMatch } from "./match-writes";
import { getPublicCardsBySlug } from "./player-cards";
import { listProfileMatches } from "./profile-matches";
import { deleteFromPitch } from "./pitches";

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
let historyPitchId: string | undefined;

async function addMatch(name: string, startsAt: Date, cancelledAt: Date | null = null, fieldId = pitchId) {
  if (!db || fieldId === undefined) throw new Error("No test database");
  const { rows } = await db.query<{ id: string }>(
    `
      INSERT INTO matches
        (created_by, pitch_id, format, starts_at, duration_in_minutes, min_attendance, cancelled_at)
      VALUES ($1, $2, '5x5', $3, 60, 10, $4)
      RETURNING id
    `,
    [hostId, fieldId, startsAt, cancelledAt],
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
  const historyPitch = await db.query<{ id: string }>(
    "INSERT INTO pitches (area, municipality, name, created_by) VALUES ($1, $2, 'CI History Pitch', $3) RETURNING id",
    [area, municipality, hostId],
  );
  historyPitchId = historyPitch.rows[0].id;

  const future = new Date(Date.now() + 3_600_000);
  const past = new Date(Date.now() - 3_600_000);
  await addMatch("concurrent", future);
  await addMatch("retry", future);
  await addMatch("past", past);
  await addMatch("cancelled", future, new Date());
  await addMatch("leave", future);
  await addMatch("retain", future);
  await addMatch("cancelFuture", new Date(Date.now() + 10 * 3_600_000), null, Number(historyPitchId));
  await addMatch("keepHistory", future, null, Number(historyPitchId));
  await addMatch("ongoing", new Date(Date.now() - 30 * 60_000));
  await addMatch("completed", new Date(Date.now() - 2 * 3_600_000));
  await addMatch("cancelledCompleted", new Date(Date.now() - 2 * 3_600_000), new Date());
  await addMatch("profileJoin", future);
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
    if (historyPitchId !== undefined) {
      await db.query("DELETE FROM pitches WHERE id = $1", [historyPitchId]);
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

test("cancelling a future match preserves registrations and frees the pitch", { skip: !db }, async () => {
  if (!db || !historyPitchId) {
    return;
  }
  const id = matches.cancelFuture;
  await registerAttendance(id, playerId, db);
  assert.equal(await cancelMatch(String(id), otherId, db), "not_found");
  assert.equal(await cancelMatch(String(id), hostId, db), "cancelled");
  assert.equal(await cancelMatch(String(id), hostId, db), "cancelled");
  const cancelledMatch = await getFullMatchById(id, playerId, db);
  assert.ok(cancelledMatch?.cancelled_at);
  assert.equal(cancelledMatch.accepts_attendance, false);
  assert.deepEqual(cancelledMatch.attendances, []);
  assert.equal((await getFullMatchById(id, hostId, db))?.attendances.length, 1);
  assert.deepEqual(await listAttendancesForMatch(id, db), []);
  assert.ok(!(await listFullMatches(area, playerId, db)).some((match) => match.id === String(id)));
  assert.equal((await listProfileMatches(playerId, "joined", db)).find((match) => match.id === String(id))?.status, "cancelled");
  await assert.rejects(registerAttendance(id, playerId, db), { message: "MATCH_CANCELLED" });

  const start = new Date(cancelledMatch.starts_at);
  const end = new Date(start.getTime() + 60 * 60_000);
  assert.deepEqual(await getPitchMatchesForDateInterval(historyPitchId, start.toISOString(), end.toISOString(), db), []);
});

test("match cancellation, rescheduling and pitch deletion preserve history after kickoff", { skip: !db }, async () => {
  if (!db || historyPitchId === undefined) {
    return;
  }
  const id = matches.keepHistory;
  await registerAttendance(id, playerId, db);
  const { rows: [original] } = await db.query<{ starts_at: Date }>(
    "UPDATE matches SET starts_at = NOW() - INTERVAL '2 hours' WHERE id = $1 RETURNING starts_at",
    [id],
  );

  assert.equal(await updateMatch({
    id,
    startsAt: new Date(Date.now() + 3600_000).toISOString(),
    pitchId: historyPitchId,
    format: "5x5",
    minAttendance: 10,
    durationInMinutes: 60,
    description: "",
    createdBy: hostId,
  }, hostId, db), null);
  assert.equal(await cancelMatch(String(id), hostId, db), "started");
  await assert.rejects(deleteFromPitch(historyPitchId, hostId, db), {
    message: "PITCH_HAS_MATCHES",
  });

  const { rows } = await db.query(
    "SELECT m.starts_at FROM matches m JOIN attendance a ON a.match_id = m.id WHERE m.id = $1 AND a.user_id = $2",
    [id, playerId],
  );
  assert.deepEqual(rows, [original]);
});

test("only the organizer can confirm an ended, non-cancelled match", { skip: !db }, async () => {
  if (!db) {
    return;
  }
  for (const id of [matches.concurrent, matches.ongoing, matches.cancelledCompleted]) {
    assert.equal((await confirmMatchPlayed(id, hostId, db)).status, "unavailable");
  }
  assert.equal((await confirmMatchPlayed(matches.completed, playerId, db)).status, "not_found");

  const results = await Promise.all(
    Array.from({ length: 5 }, () => confirmMatchPlayed(matches.completed, hostId, db)),
  );
  assert.equal(results[0].status, "confirmed");
  for (const result of results) {
    assert.deepEqual(result, results[0]);
  }

  const { rows: [match] } = await db.query(
    "SELECT played_confirmed_at FROM matches WHERE id = $1",
    [matches.completed],
  );
  assert.deepEqual(match.played_confirmed_at, results[0].confirmedAt);

  const organized = await listProfileMatches(hostId, "organized", db);
  const statusFor = (id: number) => organized.find((match) => match.id === String(id))?.status;
  assert.equal(statusFor(matches.completed), "played");
  assert.equal(statusFor(matches.cancelledCompleted), "cancelled");
  assert.equal(statusFor(matches.ongoing), "ongoing");
  assert.equal(statusFor(matches.concurrent), "upcoming");
  assert.equal(statusFor(matches.past), "pending");
  assert.deepEqual(await listProfileMatches(playerId, "organized", db), []);
});

test("the player match list includes only their own registrations", { skip: !db }, async () => {
  if (!db) {
    return;
  }
  await registerAttendance(matches.profileJoin, playerId, db);
  const joined = await listProfileMatches(playerId, "joined", db);
  assert.ok(joined.some((match) => match.id === String(matches.profileJoin)));
  const other = await listProfileMatches(otherId, "joined", db);
  assert.ok(!other.some((match) => match.id === String(matches.profileJoin)));
});

test("scheduling serializes same-pitch writes and permits adjacent slots and own edits", { skip: !db }, async () => {
  if (!db || !historyPitchId) {
    return;
  }
  const startsAt = new Date(Date.now() + 12 * 3_600_000);
  const afterMinutes = (minutes: number) => new Date(startsAt.getTime() + minutes * 60_000).toISOString();
  const input = {
    startsAt: startsAt.toISOString(),
    createdBy: hostId,
    pitchId: historyPitchId,
    durationInMinutes: 45,
    format: "5x5",
    minAttendance: 10,
    description: "",
  };
  const firstAttempts = await Promise.allSettled([saveMatch(input, db), saveMatch(input, db)]);
  const saved = firstAttempts.filter((attempt) => attempt.status === "fulfilled");
  const conflicts = firstAttempts.filter((attempt) => attempt.status === "rejected");
  matchIds.push(...saved.map((attempt) => Number(attempt.value.id)));
  assert.equal(saved.length, 1);
  assert.equal(conflicts.length, 1);
  assert.ok(conflicts[0].reason instanceof MatchScheduleError);
  assert.equal(conflicts[0].reason.code, "MATCH_TIME_CONFLICT");

  const firstId = Number(saved[0].value.id);
  const adjacent = await saveMatch({ ...input, startsAt: afterMinutes(45) }, db);
  matchIds.push(Number(adjacent.id));
  assert.equal((await updateMatch({ ...input, id: firstId }, hostId, db))?.id, String(firstId));

  await assert.rejects(
    updateMatch({ ...input, id: firstId, startsAt: afterMinutes(30) }, hostId, db),
    { message: "MATCH_TIME_CONFLICT" },
  );
  const { rows: [retained] } = await db.query("SELECT starts_at FROM matches WHERE id = $1", [firstId]);
  assert.deepEqual(retained.starts_at, startsAt);

  const edits = await Promise.allSettled([
    updateMatch({ ...input, id: firstId, startsAt: afterMinutes(120) }, hostId, db),
    updateMatch({ ...input, id: Number(adjacent.id), startsAt: afterMinutes(120) }, hostId, db),
  ]);
  assert.equal(edits.filter((edit) => edit.status === "fulfilled" && edit.value).length, 1);
  assert.equal(edits.filter((edit) => edit.status === "rejected" &&
    edit.reason instanceof MatchScheduleError && edit.reason.code === "MATCH_TIME_CONFLICT").length, 1);
});

test("the roster card batch only exposes fields each player enabled", { skip: !db }, async () => {
  if (!db) {
    return;
  }
  const playerSlug = `card-${playerId}`;
  const otherSlug = `card-${otherId}`;
  await db.query(
    `INSERT INTO player_profiles (user_id, public_slug, avatar_storage_key, visible_fields)
       VALUES ($1, $2, 'test-private-avatar', ARRAY['played']),
              ($3, $4, 'test-public-avatar', ARRAY['photo'])
     ON CONFLICT (user_id) DO UPDATE SET
       public_slug = EXCLUDED.public_slug,
       avatar_storage_key = EXCLUDED.avatar_storage_key,
       visible_fields = EXCLUDED.visible_fields`,
    [playerId, playerSlug, otherId, otherSlug],
  );
  const cards = await getPublicCardsBySlug([playerSlug, otherSlug, "missing-profile"], db);
  assert.equal(cards.size, 2);
  const player = cards.get(playerSlug);
  assert.equal(typeof player?.played, "number");
  assert.deepEqual(player, { name: "Player", badges: [], played: player?.played });
  assert.deepEqual(cards.get(otherSlug), { name: "Other", badges: [], photo: `/players/${otherSlug}/portrait` });
});
