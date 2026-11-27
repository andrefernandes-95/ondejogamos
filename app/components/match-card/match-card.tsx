import type { FullMatch } from "@/app/models/match";
import { formatMatchDate } from "@/app/utils/match-date";
import { AppRoutes } from "@/app/utils/routes";
import { ArrowForwardRounded, ScheduleRounded } from "@mui/icons-material";
import { Alert, Box, Button, Card, Link, Stack, Typography } from "@mui/material";
import { softEntrance } from "@/app/design/motion";
import { useLocale, useTranslations } from "next-intl";
import { MatchAttendanceAction, useMatchAttendance } from "./match-attendance";
import MatchAttendanceStatus from "./match-attendance-status";
import MatchOrganizer from "./match-organizer";
import MatchPitchPhoto from "./match-pitch-photo";

export default function MatchCard({
  match, onAttendanceChanged,
}: {
  match: FullMatch;
  onAttendanceChanged: () => void;
}) {
  const t = useTranslations("App.Agenda");
  const tCard = useTranslations("App.MatchCard");
  const { time } = formatMatchDate(match.starts_at, useLocale());
  const { error, pending, handleAttendance } = useMatchAttendance(match.id, onAttendanceChanged);
  const locality = [match.pitch.municipality, match.pitch.area].filter(Boolean).join(", ");
  const detailsUrl = AppRoutes.MATCH_DETAILS(String(match.id));

  return (
    <Card component="li" variant="outlined" sx={{
      ...softEntrance, display: "grid", borderRadius: 3, p: { xs: 1.5, sm: 2 },
      gridTemplateAreas: {
        xs: '"photo details" "attendance attendance" "error error"',
        md: '"photo details attendance" "error error error"',
      },
      gridTemplateColumns: { xs: "64px minmax(0, 1fr)", sm: "104px minmax(0, 1fr)", md: "152px minmax(0, 1fr) auto" },
      columnGap: { xs: 1.25, md: 2 }, alignItems: "center",
    }}>
      <Box sx={{ gridArea: "photo", alignSelf: { xs: "start", md: "center" } }}>
        <MatchPitchPhoto src={match.pitch.image_url} compact />
      </Box>
      <Stack spacing={0.5} sx={{ gridArea: "details", minWidth: 0, overflowWrap: "anywhere" }}>
        <Typography component="time" dateTime={new Date(match.starts_at).toISOString()} color="primary"
          sx={{
            display: "inline-flex", alignItems: "center", gap: 0.5, alignSelf: "flex-start",
            fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1.2,
          }}>
          <ScheduleRounded sx={{ fontSize: 16 }} />
          {time}
        </Typography>
        <Link href={detailsUrl} underline="hover" color="text.primary"
          sx={{ fontWeight: 750, fontSize: { xs: "1rem", md: "1.25rem" }, lineHeight: 1.2 }}>
          {match.pitch.name}
        </Link>
        <Typography variant="body2" color="text.secondary">
          {locality} · {t("format", { count: Number(match.format.split("x")[0]) })}
        </Typography>
        <MatchOrganizer player={match.creator} />
      </Stack>
      <Stack sx={{
        gridArea: "attendance", alignItems: { xs: "flex-start", md: "flex-end" },
        gap: 0.75, mt: { xs: 1.25, md: 0 }, pt: { xs: 1.25, md: 0 }, pl: { md: 2 },
      }}>
        <MatchAttendanceStatus match={match} />
        <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.75 }}>
          <Button href={detailsUrl} variant="outlined" size="small" endIcon={<ArrowForwardRounded />}
            sx={{ "@media (max-width: 349px)": { px: 1, fontSize: "0.82rem", "& .MuiButton-endIcon": { display: "none" } } }}>
            {tCard("see_details")}
          </Button>
          <MatchAttendanceAction match={match} pending={pending} handleAttendance={handleAttendance} />
        </Stack>
      </Stack>
      {error && <Alert severity="error" sx={{ gridArea: "error", mt: 1 }}>{error}</Alert>}
    </Card>
  );
}
