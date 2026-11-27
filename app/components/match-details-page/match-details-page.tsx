"use client";

import PageContainer from "@/app/components/page-container/page-container";
import { brandBlueLight } from "@/app/design/brand-colors";
import CancelMatch from "@/app/components/delete-match-button/delete-match-button";
import EditMatch from "@/app/components/edit-match/edit-match";
import { MatchAttendanceAction, useMatchAttendance } from "@/app/components/match-card/match-attendance";
import MatchAttendanceStatus from "@/app/components/match-card/match-attendance-status";
import MatchPitchPhoto from "@/app/components/match-card/match-pitch-photo";
import MatchShareButtons from "@/app/components/match-share-buttons/match-share-buttons";
import type { FullMatch } from "@/app/models/match";
import { AppRoutes } from "@/app/utils/routes";
import { ChevronLeft, EventAvailable } from "@mui/icons-material";
import { Alert, Button, Card, Divider, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import ConfirmMatchPlayed from "./confirm-match-played";
import MatchDescription from "./match-description";
import MatchDetailsInfo from "./match-details-info";
import RepeatMatchButton from "./repeat-match-button";

export default function MatchDetailsPage({ match, children }: { match: FullMatch; children?: ReactNode }) {
  const t = useTranslations("App.MatchDetailsPage");
  const router = useRouter();
  const { error, pending, handleAttendance } = useMatchAttendance(match.id, () => router.refresh());
  const cancelled = Boolean(match.cancelled_at);

  return (
    <PageContainer>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Button href={AppRoutes.GAMES} startIcon={<ChevronLeft />}>{t("go_back")}</Button>
          {match.is_creator && match.accepts_attendance && (
            <Stack direction="row" sx={{ alignItems: "center" }}>
              <EditMatch match={match} />
              <CancelMatch match={match} />
            </Stack>
          )}
          {match.is_creator && (match.can_confirm_played || match.played_confirmed_at) && (
            <RepeatMatchButton match={match} />
          )}
        </Stack>
        {error && <Alert variant="filled" severity="error">{error}</Alert>}
        {cancelled && <Alert severity="warning">{t("match_cancelled")}</Alert>}
        <Card variant="outlined" sx={{
          borderRadius: 6, p: { xs: 2, sm: 3, md: 4 },
        }}>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }}>
              <Stack spacing={2} sx={{ minWidth: 0, flex: 1 }}>
                <MatchDetailsInfo match={match} />
                <ConfirmMatchPlayed
                  key={match.id}
                  matchId={match.id}
                  confirmed={Boolean(match.played_confirmed_at)}
                  canConfirm={Boolean(match.can_confirm_played)}
                />
                {!cancelled && (
                  <Stack direction="row" sx={{
                    alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap",
                    bgcolor: brandBlueLight, borderRadius: 3, p: 1.5,
                  }}>
                    {match.accepts_attendance && <MatchAttendanceStatus match={match} />}
                    <MatchAttendanceAction match={match} details pending={pending} handleAttendance={handleAttendance} />
                  </Stack>
                )}
              </Stack>
              {match.pitch.image_url && <MatchPitchPhoto src={match.pitch.image_url} details />}
            </Stack>
            <MatchDescription description={match.description} title={t("organizer_notes")} />
            {!cancelled && (
              <>
                <Divider />
                <MatchShareButtons match={match} />
                {match.accepts_attendance && (
                  <Button href={AppRoutes.MATCH_CALENDAR(match.id)} size="small" startIcon={<EventAvailable />}
                    sx={{ alignSelf: "flex-start" }}>
                    {t("add_to_calendar")}
                  </Button>
                )}
              </>
            )}
          </Stack>
        </Card>
        {children}
      </Stack>
    </PageContainer>
  );
}
