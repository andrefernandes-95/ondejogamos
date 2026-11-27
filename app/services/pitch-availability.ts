import { pool } from "@/app/lib/db";
import type { Pool, PoolClient } from "pg";
import { shiftAgendaDay } from "@/app/utils/agenda-date";
import { parseLisbonSlot } from "@/app/utils/lisbon-slot";
import { slotEndTime } from "@/app/utils/match-time-range";
import { listPitchesForArea, type PitchSummary } from "./pitches";
import { availablePitchTimes, scheduleCandidates } from "@/app/utils/pitch-slots";

export interface OccupiedMatchSlot {
  id: string;
  starts_at: Date | string;
  duration_in_minutes: number;
}

export async function getPitchMatchesForDateInterval(
  pitchId: string,
  from: string,
  until: string,
  db: Pool | PoolClient = pool,
): Promise<OccupiedMatchSlot[]> {
  const { rows } = await db.query<OccupiedMatchSlot>(
    `SELECT id, starts_at, duration_in_minutes
     FROM matches
     WHERE pitch_id = $1 AND cancelled_at IS NULL
       AND starts_at < $3::timestamptz
       AND starts_at + duration_in_minutes * INTERVAL '1 minute' > $2::timestamptz
     ORDER BY starts_at, id`,
    [pitchId, from, until],
  );
  return rows;
}

export type PitchWithSlots = PitchSummary & { times: string[] };

export async function listPitchesWithSlots(area: string, day: string, duration: number): Promise<PitchWithSlots[]> {
  const from = parseLisbonSlot(day, "00:00")!.toISOString();
  const nextDay = parseLisbonSlot(shiftAgendaDay(day, 1), "00:00")!;
  const until = new Date(slotEndTime(nextDay.valueOf(), duration)).toISOString();
  const [pitches, { rows }] = await Promise.all([
    listPitchesForArea(area),
    pool.query<OccupiedMatchSlot & { pitch_id: string }>(
      `SELECT m.pitch_id, m.starts_at, m.duration_in_minutes
       FROM matches m JOIN pitches p ON p.id = m.pitch_id
       WHERE p.area = $1 AND m.cancelled_at IS NULL
         AND m.starts_at < $3::timestamptz
         AND m.starts_at + m.duration_in_minutes * INTERVAL '1 minute' > $2::timestamptz`,
      [area, from, until],
    ),
  ]);
  const byPitch = Map.groupBy(rows, (row) => String(row.pitch_id));
  const candidates = scheduleCandidates(day, Date.now());
  return pitches.map((pitch) => ({
    ...pitch,
    times: availablePitchTimes(candidates, byPitch.get(String(pitch.id)) ?? [], duration),
  }));
}
