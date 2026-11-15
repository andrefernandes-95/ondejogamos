import MatchOrganizer from "@/app/components/match-card/match-organizer";
import PitchUrlButton from "@/app/components/pitch-url-button/pitch-url-button";
import type { FullMatch } from "@/app/models/match";
import { formatMatchDate } from "@/app/utils/match-date";
import { AccessTime, CalendarMonth, Group, LocationPin, MyLocation } from "@mui/icons-material";
import { Divider, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

export default function MatchDetailsInfo({ match }: { match: FullMatch }) {
  const t = useTranslations("App.MatchDetailsPage");
  const { day, time } = formatMatchDate(match.starts_at, useLocale(), true);
  const item = { alignItems: "center", gap: 0.5, flexWrap: "wrap" };
  return (
    <>
      <Stack direction="row" sx={item}>
        <CalendarMonth sx={{ fontSize: 28 }} />
        <Typography variant="h5" sx={{ textTransform: "capitalize" }}>{day}</Typography>
      </Stack>
      <Stack direction="row" sx={item}>
        <AccessTime sx={{ fontSize: 28 }} />
        <Typography variant="h5">{time}</Typography>
      </Stack>
      <Divider />
      <Stack direction="row" sx={item}>
        <MyLocation />
        <Typography>{t("place")}: <strong>{match.pitch.name}</strong></Typography>
        {match.pitch.maps_url && <PitchUrlButton maps_url={match.pitch.maps_url} />}
      </Stack>
      <Stack direction="row" sx={item}>
        <LocationPin />
        <Typography>{match.pitch.municipality}, {match.pitch.area}</Typography>
      </Stack>
      <Divider />
      <MatchOrganizer player={match.creator} />
      <Stack direction="row" sx={item}>
        <Group />
        <Typography>{t("match_format")}: <strong>{match.format}</strong></Typography>
      </Stack>
      <Stack direction="row" sx={item}>
        <AccessTime />
        <Typography>
          {t("duration")}: <strong>{match.duration_in_minutes} {t("minutes")}</strong>
        </Typography>
      </Stack>
    </>
  );
}
