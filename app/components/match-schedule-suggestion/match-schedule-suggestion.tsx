import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import { useSuggestPitches } from "@/app/hooks/pitches";
import type { Pitch } from "@/app/services/pitches";
import { LocationOn } from "@mui/icons-material";
import { Box, Card, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";

const maxSuggestions = 4;

export default function MatchScheduleSuggestion({ area, onAddPitch }: {
  area: string;
  onAddPitch: (area: string) => void;
}) {
  const t = useTranslations("App.MatchScheduleSuggestion");
  const pitches = useSuggestPitches(area, maxSuggestions);

  if (!pitches.length) return null;
  return (
    <Stack spacing={1.5} sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary">{t("choose_a_pitch_to_start")}</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: {
        xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))",
      }, gap: 1.5 }}>
        {pitches.slice(0, maxSuggestions).map((pitch) => (
          <SuggestedPitch pitch={pitch} key={pitch.id} onAddPitch={() => onAddPitch(pitch.area)} />
        ))}
      </Box>
    </Stack>
  );
}

function SuggestedPitch({ pitch, onAddPitch }: { pitch: Pitch; onAddPitch: () => void }) {
  return (
    <Card variant="outlined" sx={{ p: 0, display: "flex", flexDirection: "column" }}>
      {pitch.image_url && (
        <Box sx={{ position: "relative", aspectRatio: "3 / 1", overflow: "hidden" }}>
          <Image src={pitch.image_url} alt="" fill sizes="(max-width: 600px) 90vw, 25vw"
            style={{ objectFit: "cover" }} />
        </Box>
      )}
      <Stack spacing={0.5} sx={{ p: 1.25, alignItems: "start", flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{pitch.name}</Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary" }}>
          <LocationOn sx={{ fontSize: 15 }} />
          <Typography variant="body2">{pitch.municipality}, {pitch.area}</Typography>
        </Stack>
        <Box sx={{ flex: 1 }} />
        <ScheduleMatchButton isSmall selectedArea={pitch.area} selectedPitch={String(pitch.id)} onAddPitch={onAddPitch} />
      </Stack>
    </Card>
  );
}
