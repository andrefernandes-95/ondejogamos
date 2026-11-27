import MatchOrganizer from "@/app/components/match-card/match-organizer";
import PageTitle from "@/app/components/page-title/page-title";
import PitchUrlButton from "@/app/components/pitch-url-button/pitch-url-button";
import type { FullMatch } from "@/app/models/match";
import { formatMatchDate } from "@/app/utils/match-date";
import { Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

export default function MatchDetailsInfo({ match }: { match: FullMatch }) {
  const t = useTranslations("App.MatchDetailsPage");
  const { day, time } = formatMatchDate(match.starts_at, useLocale(), true);
  const locality = [match.pitch.municipality, match.pitch.area].filter(Boolean).join(", ");

  return (
    <Stack spacing={1.5}>
      <Typography component="time" dateTime={new Date(match.starts_at).toISOString()} color="primary"
        sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", "&::first-letter": { textTransform: "uppercase" } }}>
        {day} · {time}
      </Typography>
      <Stack spacing={0.5}>
        <PageTitle title={match.pitch.name} description={locality} />
        {match.pitch.maps_url && <PitchUrlButton maps_url={match.pitch.maps_url} showLabel />}
      </Stack>
      <Typography variant="body2" sx={{ fontWeight: 650 }}>
        {t("match_summary", { format: match.format, duration: match.duration_in_minutes })}
      </Typography>
      <MatchOrganizer player={match.creator} />
    </Stack>
  );
}
