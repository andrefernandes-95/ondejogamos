import type { PlayerIdentity } from "@/app/models/player-identity";
import { Pitch } from "@/app/services/pitches";
import { User } from "better-auth";

export interface Match {
  id: string;
  creator: Partial<User>;
  pitch: Partial<Pitch>;
  duration_in_minutes: number;
  format: "5x5" | "7x7" | "11x11"; // 5x5 | 7x7 | 11x11
  attendanceCount: number;
  min_attendance: number; // 10 players
  created_at: Date;
  starts_at: Date;
  cancelled_at: Date | null;
  description: string;
}

export interface FullMatch extends Match {
  accepts_attendance: boolean;
  played_confirmed_at?: Date | string | null;
  can_confirm_played?: boolean;
  attendances: Array<{
    user_id: string;
    user_name: string;
    created_at: string;
    player: PlayerIdentity;
  }>;
  is_attending: boolean;
  is_creator: boolean;
  creator: PlayerIdentity & { id?: string };
}
