import { pool } from "@/app/lib/db";
import { Attendance } from "@/app/models/attendance";

export async function listAttendancesForMatch(
  match_id: number,
): Promise<Attendance[]> {
  const result = await pool.query(
    `
            SELECT
              a.id,
              a.match_id,
              a.created_at,
              a.updated_at,
              u.id AS user_id,
              u.name AS username
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
  match_id: number,
  user_id: string,
): Promise<Attendance> {
  const result = await pool.query(
    `
      INSERT INTO ATTENDANCE(
        match_id, user_id
      ) values ($1, $2)
      RETURNING *
    `,
    [match_id, user_id],
  );

  return result.rows[0];
}

export async function deleteAttendance(match_id: number, user_id: string) {
  await pool.query(
    `
      DELETE FROM "attendance" WHERE match_id = $1 AND user_id = $2`,
    [match_id, user_id],
  );

  return null;
}
