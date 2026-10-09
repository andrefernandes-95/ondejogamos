export interface Attendance {
  id: number;
  match_id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWithUserDetails extends Attendance {
  username: string;
}
