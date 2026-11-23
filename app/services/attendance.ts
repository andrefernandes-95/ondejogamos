import { pool } from "@/app/lib/db";
import type { Attendance } from "@/app/models/attendance";
import type { Pool, PoolClient } from "pg";

type Database = Pick<Pool, "connect">;
type MatchRow = {
  starts_at: Date;
  cancelled_at: Date | null;
  created_by: string;
};
type AttendanceErrorCode =
  | "MATCH_NOT_FOUND"
  | "MATCH_ALREADY_STARTED"
  | "MATCH_CANCELLED"
  | "FORBIDDEN";

export class AttendanceError extends Error {
  constructor(
    public readonly code: AttendanceErrorCode,
    public readonly status: 403 | 404 | 409,
  ) {
    super(code);
  }
}

function ensureMatchOpen(match: MatchRow) {
  if (match.cancelled_at) {
    throw new AttendanceError("MATCH_CANCELLED", 409);
  }
  if (new Date(match.starts_at).getTime() <= Date.now()) {
    throw new AttendanceError("MATCH_ALREADY_STARTED", 409);
  }
}

/** Serialize attendance changes with match edits/deletions. */
async function withLockedMatch<T>(
  matchId: number,
  db: Database,
  action: (client: PoolClient, match: MatchRow) => Promise<T>,
): Promise<T> {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<MatchRow>(
      "SELECT starts_at, cancelled_at, created_by FROM matches WHERE id = $1 FOR UPDATE",
      [matchId],
    );
    const match = rows[0];
    if (!match) throw new AttendanceError("MATCH_NOT_FOUND", 404);

    const result = await action(client, match);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listAttendancesForMatch(
  match_id: number,
): Promise<Attendance[]> {
  const result = await pool.query(
    `
      SELECT
        a.id, a.match_id, a.created_at, a.updated_at,
        u.id AS user_id, u.name AS username
      FROM attendance AS a
      LEFT JOIN "user" AS u ON u.id = a.user_id
      WHERE a.match_id = $1
      ORDER BY a.created_at, a.id
    `,
    [match_id],
  );
  return result.rows;
}

export async function registerAttendance(
  matchId: number,
  userId: string,
  db: Database = pool,
): Promise<{ attendance: Attendance; created: boolean }> {
  return withLockedMatch(matchId, db, async (client, match) => {
    if (match.created_by === userId) {
      throw new AttendanceError("FORBIDDEN", 403);
    }

    // A retry remains successful even if the game has since started.
    const existing = await client.query<Attendance>(
      "SELECT * FROM attendance WHERE match_id = $1 AND user_id = $2",
      [matchId, userId],
    );
    if (existing.rows[0]) {
      return { attendance: existing.rows[0], created: false };
    }

    ensureMatchOpen(match);
    const inserted = await client.query<Attendance>(
      `
        INSERT INTO attendance (match_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (match_id, user_id) DO NOTHING
        RETURNING *
      `,
      [matchId, userId],
    );
    if (inserted.rows[0]) {
      return { attendance: inserted.rows[0], created: true };
    }

    // The unique constraint also protects against writers outside this service.
    const concurrent = await client.query<Attendance>(
      "SELECT * FROM attendance WHERE match_id = $1 AND user_id = $2",
      [matchId, userId],
    );
    if (!concurrent.rows[0]) throw new Error("Attendance insert returned no row");
    return { attendance: concurrent.rows[0], created: false };
  });
}

export async function deleteAttendance(
  matchId: number,
  userId: string,
  db: Database = pool,
): Promise<null> {
  return withLockedMatch(matchId, db, async (client, match) => {
    const existing = await client.query<{ id: string }>(
      "SELECT id FROM attendance WHERE match_id = $1 AND user_id = $2",
      [matchId, userId],
    );
    if (!existing.rows[0]) return null;

    // Preserve registrations as historical evidence once the game starts.
    ensureMatchOpen(match);
    await client.query(
      "DELETE FROM attendance WHERE match_id = $1 AND user_id = $2",
      [matchId, userId],
    );
    return null;
  });
}
