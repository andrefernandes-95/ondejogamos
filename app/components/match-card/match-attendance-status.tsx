import type { FullMatch } from "@/app/models/match";
import { CheckCircleOutlineRounded, GroupOutlined } from "@mui/icons-material";
import { alpha, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function MatchAttendanceStatus({ match }: {
  match: Pick<FullMatch, "min_attendance" | "attendances">;
}) {
  const t = useTranslations("App.MatchAttendance");
  const registeredPlayers = match.attendances.length + 1; // The organizer also plays.
  const playersNeeded = match.min_attendance - registeredPlayers;
  const enoughPlayers = playersNeeded <= 0;
  const Icon = enoughPlayers ? CheckCircleOutlineRounded : GroupOutlined;

  return (
    <Stack direction="row" role="status" sx={(theme) => {
      const color = enoughPlayers ? theme.palette.success.dark : theme.palette.primary.dark;
      return {
        alignItems: "center", width: "fit-content", gap: 0.75, maxWidth: "100%",
        py: 0.65, px: 1.25, borderRadius: "999px", color, bgcolor: alpha(color, 0.08),
      };
    }}>
      <Icon aria-hidden="true" sx={{ fontSize: 18, flexShrink: 0 }} />
      <Typography variant="body2" sx={{ fontWeight: 750 }}>
        {enoughPlayers ? t("minimum_reached") : t("players_needed", { count: playersNeeded })}
      </Typography>
    </Stack>
  );
}
