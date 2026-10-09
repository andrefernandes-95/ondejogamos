import { Attendance } from "@/app/models/attendance";
import { Pitch } from "@/app/services/pitches";
import { User } from "better-auth";

export interface Match {
  id: string;
  creator: Partial<User>;
  pitch: Partial<Pitch>;
  durationInMinutes: number;
  format: "5x5" | "7x7" | "11x11"; // 5x5 | 7x7 | 11x11
  attendanceCount: number;
  min_attendance: number; // 10 players
  created_at: Date;
  starts_at: Date;
  cancelled_at: Date;
  description: string;
}

export interface FullMatch extends Match {
  attendances: Array<{
    user_id: string;
    user_name: string;
    created_at: string;
  }>;
  is_attending: boolean;
  is_creator: boolean;
  creator: { id: string; name: string };
}
