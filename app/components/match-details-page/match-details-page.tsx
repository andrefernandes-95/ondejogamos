"use client";

import { Background } from "@/app/components/background/background";
import CancelMatch from "@/app/components/delete-match-button/delete-match-button";
import EditMatch from "@/app/components/edit-match/edit-match";
import { MatchAttendanceAction, MatchAttendanceStatus, useMatchAttendance } from "@/app/components/match-card/match-attendance";
import MatchPitchPhoto from "@/app/components/match-card/match-pitch-photo";
import MatchShareButtons from "@/app/components/match-share-buttons/match-share-buttons";
import type { FullMatch } from "@/app/models/match";
import { AppRoutes } from "@/app/utils/routes";
import { ChevronLeft, EventAvailable } from "@mui/icons-material";
import { Alert, Box, Button, Card, Container, Divider, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ConfirmMatchPlayed from "./confirm-match-played";
import MatchDetailsInfo from "./match-details-info";
import MatchPlayers from "./match-players";
import RepeatMatchButton from "./repeat-match-button";

export default function MatchDetailsPage({ match }: { match: FullMatch }) {
  const t = useTranslations("App.MatchDetailsPage");
  const router = useRouter();
  const { error, handleAttendance } = useMatchAttendance(match.id, () => router.refresh());
  const cancelled = Boolean(match.cancelled_at);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Background />
      <Stack spacing={2}>
        <Stack direction="row" sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Button href={AppRoutes.HOME} startIcon={<ChevronLeft />}>{t("go_back")}</Button>
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
        <Card variant="outlined" sx={{ borderRadius: 6, p: 1 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <MatchPitchPhoto src={match.pitch.image_url!} details />
            <Stack spacing={2} sx={{ p: 2, minWidth: 0, flexGrow: 1 }}>
              <MatchDetailsInfo match={match} />
              <ConfirmMatchPlayed
                key={match.id}
                matchId={match.id}
                confirmed={Boolean(match.played_confirmed_at)}
                canConfirm={Boolean(match.can_confirm_played)}
              />
              {!cancelled && (
                <>
                  <Divider />
                  <Stack direction="row" sx={{
                    alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap",
                  }}>
                    {match.accepts_attendance && <MatchAttendanceStatus match={match} details />}
                    <MatchAttendanceAction match={match} details handleAttendance={handleAttendance} />
                  </Stack>
                  <Divider />
                  <Stack direction="row" sx={{ justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                    {match.accepts_attendance && (
                      <Button href={AppRoutes.MATCH_CALENDAR(match.id)} size="small" startIcon={<EventAvailable />}>
                        {t("add_to_calendar")}
                      </Button>
                    )}
                    <Box><MatchShareButtons match={match} /></Box>
                  </Stack>
                </>
              )}
            </Stack>
          </Stack>
        </Card>
        {(!cancelled || match.is_creator) && <MatchPlayers match={match} />}
      </Stack>
    </Container>
  );
}
