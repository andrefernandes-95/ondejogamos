import MatchOrganizer from "@/app/components/match-card/match-organizer";
import type { FullMatch } from "@/app/models/match";
import { formatMatchDate } from "@/app/utils/match-date";
import { OpenInNew } from "@mui/icons-material";
import { Link, Stack, Typography } from "@mui/material";
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
        <Typography component="h1" sx={{
          fontSize: { xs: "clamp(1.8rem, 7vw, 2.5rem)", md: "clamp(2.5rem, 4vw, 3.5rem)" },
          fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", overflowWrap: "anywhere",
        }}>
          {match.pitch.name}
        </Typography>
        {locality && <Typography color="text.secondary">{locality}</Typography>}
        {match.pitch.maps_url && (
          <Link href={match.pitch.maps_url} target="_blank" rel="noopener noreferrer"
            underline="hover"
            sx={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 0.75, minHeight: 44 }}>
            {t("directions")} <OpenInNew sx={{ fontSize: 16 }} />
          </Link>
        )}
      </Stack>
      <Typography variant="body2" sx={{ fontWeight: 650 }}>
        {t("match_summary", { format: match.format, duration: match.duration_in_minutes })}
      </Typography>
      <MatchOrganizer player={match.creator} />
    </Stack>
  );
}
