import ParticipateButton from "@/app/components/participate-button/participate-button";
import type { FullMatch } from "@/app/models/match";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { Group } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function useMatchAttendance(matchId: string, onAttendanceChanged: () => void) {
  const t = useTranslations("ApiErrors");
  const [error, setError] = useState("");

  async function handleAttendance({ isAttending }: { isAttending: boolean }) {
    setError("");
    const body = new FormData();
    body.append("match_id", matchId);
    try {
      const response = await fetch("/api/attendance", { method: isAttending ? "POST" : "DELETE", body });
      if (!response.ok) {
        setError(t(await readApiErrorCodeFromResponse(response)));
        return;
      }
      onAttendanceChanged();
    } catch {
      setError(t("INTERNAL_ERROR"));
    }
  }

  return { error, handleAttendance };
}

type MatchAttendanceProps = { match: FullMatch; details?: boolean; compact?: boolean };

export function MatchAttendanceStatus({ match, details, compact }: MatchAttendanceProps) {
  const t = useTranslations(details ? "App.MatchDetailsPage" : "App.MatchCard");
  const agenda = useTranslations("App.Agenda");
  const remaining = match.min_attendance - 1 - match.attendances.length;
  const color = remaining <= 0 ? "warning" : "success";
  const full = details ? "enough_players_you_can_still_join" : "match_is_full_you_can_still_participate";

  if (compact) {
    return (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {remaining <= 0 ? t(full) : agenda("players_needed", { count: remaining })}
      </Typography>
    );
  }
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      <Group color={color} />
      <Typography color={color}>{remaining <= 0 ? t(full) : t("spots_available", { count: remaining })}</Typography>
    </Stack>
  );
}

export function MatchAttendanceAction({ match, details, handleAttendance }: MatchAttendanceProps & {
  handleAttendance: ({ isAttending }: { isAttending: boolean }) => void;
}) {
  const t = useTranslations(details ? "App.MatchDetailsPage" : "App.MatchCard");
  if (match.is_creator) return <Typography variant="caption">{t("scheduled_by_you")}</Typography>;
  if (!match.is_attending) return <ParticipateButton handleAttendance={handleAttendance} />;
  return (
    <Button variant="text" onClick={() => handleAttendance({ isAttending: false })}>
      {t("cancel_participation")}
    </Button>
  );
}
