import type { FullMatch } from "@/app/models/match";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function MatchAttendanceStatus({ match }: {
  match: Pick<FullMatch, "min_attendance" | "attendances">;
}) {
  const t = useTranslations("App.MatchAttendance");
  const registeredPlayers = match.attendances.length + 1; // The organizer also plays.
  const playersNeeded = match.min_attendance - registeredPlayers;

  return (
    <Typography variant="body2" sx={{ fontWeight: 650 }}>
      {playersNeeded > 0 ? t("players_needed", { count: playersNeeded }) : t("minimum_reached")}
    </Typography>
  );
}
