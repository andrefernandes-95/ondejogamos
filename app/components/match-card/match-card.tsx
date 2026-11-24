import type { FullMatch } from "@/app/models/match";
import { formatMatchDate } from "@/app/utils/match-date";
import { AppRoutes } from "@/app/utils/routes";
import { Alert, Box, Link, Stack, Typography } from "@mui/material";
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
  const { time } = formatMatchDate(match.starts_at, useLocale());
  const { error, handleAttendance } = useMatchAttendance(match.id, onAttendanceChanged);
  const locality = [match.pitch.municipality, match.pitch.area].filter(Boolean).join(", ");

  return (
    <Box component="li" sx={{
      display: "grid",
      gridTemplateAreas: {
        xs: '"photo details" "attendance attendance" "error error"',
        md: '"time photo details attendance" "error error error error"',
      },
      gridTemplateColumns: { xs: "minmax(76px, 30%) minmax(0, 1fr)", md: "105px 160px minmax(0, 1fr) auto" },
      columnGap: { xs: 1.5, md: 2 }, alignItems: "center",
      minHeight: { md: "var(--row-height)" }, py: { xs: 1.75, md: 1.5 },
      "& + &": { borderTop: 1, borderColor: "divider" },
    }}>
      <Box sx={{ gridArea: "photo" }}>
        <MatchPitchPhoto src={match.pitch.image_url} compact />
      </Box>
      <Typography component="time" dateTime={new Date(match.starts_at).toISOString()}
        sx={{
          display: { xs: "none", md: "block" }, gridArea: "time", position: "relative", pl: 2.75,
          fontWeight: 750, fontSize: "1.5rem", fontVariantNumeric: "tabular-nums",
          "&::before": {
            content: '""', position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
            width: 12, height: 12, borderRadius: "50%", bgcolor: "primary.main",
          },
        }}>
        {time}
      </Typography>
      <Stack spacing={0.5} sx={{ gridArea: "details", minWidth: 0, overflowWrap: "anywhere" }}>
        <Typography component="time" dateTime={new Date(match.starts_at).toISOString()}
          color="primary" sx={{
            display: { xs: "block", md: "none" }, fontWeight: 750,
            fontSize: "1.3rem", fontVariantNumeric: "tabular-nums", lineHeight: 1.15,
          }}>
          {time}
        </Typography>
        <Link href={AppRoutes.MATCH_DETAILS(String(match.id))} underline="hover" color="text.primary"
          sx={{ fontWeight: 750, fontSize: { xs: "1rem", md: "1.25rem" }, lineHeight: 1.2 }}>
          {match.pitch.name}
        </Link>
        <Typography variant="body2" color="text.secondary">
          {locality} · {t("format", { count: Number(match.format.split("x")[0]) })}
        </Typography>
        <MatchOrganizer player={match.creator} />
      </Stack>
      <Stack direction="row" sx={{
        gridArea: "attendance", alignItems: "center", flexWrap: "wrap",
        justifyContent: { xs: "space-between", md: "flex-end" },
        gap: { xs: 1, md: 2 }, mt: { xs: 1, md: 0 },
      }}>
        <MatchAttendanceStatus match={match} />
        <MatchAttendanceAction match={match} handleAttendance={handleAttendance} />
      </Stack>
      {error && <Alert severity="error" sx={{ gridArea: "error", mt: 1 }}>{error}</Alert>}
    </Box>
  );
}
