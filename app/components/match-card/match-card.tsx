import PitchUrlButton from "@/app/components/pitch-url-button/pitch-url-button";
import type { FullMatch } from "@/app/models/match";
import { formatMatchDate } from "@/app/utils/match-date";
import { AppRoutes } from "@/app/utils/routes";
import { AccessTime, CalendarMonth, Group, LocationPin, MyLocation } from "@mui/icons-material";
import { Alert, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { MatchAttendanceAction, MatchAttendanceStatus, useMatchAttendance } from "./match-attendance";
import MatchOrganizer from "./match-organizer";
import MatchPitchPhoto from "./match-pitch-photo";

interface Props {
  match: FullMatch;
  onAttendanceChanged: () => void;
}

export default function MatchCard({ match, onAttendanceChanged }: Props) {
  const t = useTranslations("App.MatchCard");
  const { day, time } = formatMatchDate(match.starts_at, useLocale());
  const { error, handleAttendance } = useMatchAttendance(match.id, onAttendanceChanged);
  const row = { alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 0.5 };
  const item = { alignItems: "center", gap: 0.5 };

  return (
    <Card sx={{ borderRadius: 6, p: 1 }} variant="outlined">
      {error && <Alert severity="error">{error}</Alert>}
      <MatchPitchPhoto src={match.pitch.image_url!} />
      <Stack spacing={1} sx={{ p: 2 }}>
        <Stack direction="row" sx={row}>
          <Stack direction="row" sx={item}>
            <CalendarMonth sx={{ fontSize: 18 }} />
            <Typography sx={{ textTransform: "capitalize" }}>{day}</Typography>
          </Stack>
          <Stack direction="row" sx={item}>
            <AccessTime sx={{ fontSize: 18 }} />
            <Typography color="text.secondary">{time}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="row" sx={row}>
          <Stack direction="row" sx={item}>
            <MyLocation />
            <Typography>{match.pitch.name}</Typography>
            {match.pitch.maps_url && <PitchUrlButton maps_url={match.pitch.maps_url} />}
          </Stack>
          <Stack direction="row" sx={item}>
            <LocationPin />
            <Typography color="text.secondary">{match.pitch.municipality}, {match.pitch.area}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="row" sx={row}>
          <Stack direction="row" sx={item}>
            <Group />
            <Typography>{match.format}</Typography>
          </Stack>
          <MatchAttendanceStatus match={match} />
        </Stack>
        <MatchOrganizer player={match.creator} />
        <Stack direction="row" sx={row}>
          <MatchAttendanceAction match={match} handleAttendance={handleAttendance} />
          <Button href={AppRoutes.MATCH_DETAILS(String(match.id))} size="small"
            sx={{ minWidth: "unset" }} aria-label={t("open_match_details")}>
            {t("see_details")}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
