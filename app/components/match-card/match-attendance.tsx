import ParticipateButton from "@/app/components/participate-button/participate-button";
import type { FullMatch } from "@/app/models/match";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { Button, Typography } from "@mui/material";
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

export function MatchAttendanceAction({ match, details, handleAttendance }: {
  match: FullMatch;
  details?: boolean;
  handleAttendance: ({ isAttending }: { isAttending: boolean }) => void;
}) {
  const t = useTranslations(details ? "App.MatchDetailsPage" : "App.MatchCard");
  if (match.is_creator) {
    return <Typography variant="caption">{t("scheduled_by_you")}</Typography>;
  }
  if (!match.accepts_attendance) {
    return <Typography variant="caption" color="text.secondary">{t("registration_closed")}</Typography>;
  }
  if (!match.is_attending) {
    return <ParticipateButton handleAttendance={handleAttendance} />;
  }
  return (
    <Button variant="text" onClick={() => handleAttendance({ isAttending: false })}>
      {t("cancel_participation")}
    </Button>
  );
}
