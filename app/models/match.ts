import { Pitch } from "@/app/services/pitches";
import { User } from "better-auth";

export interface Match {
  id: string;
  creator: Partial<User>;
  pitch: Partial<Pitch>;
  durationInMinutes: number;
  format: "5x5" | "7x7" | "11x11"; // 5x5 | 7x7 | 11x11
  attendanceCount: number;
  minAttendance: number; // 10 players
  createdAt: Date;
  startsAt: Date;
  cancelledAt: Date;
  description: string;
}
