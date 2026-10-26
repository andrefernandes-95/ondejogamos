import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import useLocalization from "@/app/hooks/locale";
import { useSuggestPitches } from "@/app/hooks/pitches";
import { Pitch } from "@/app/services/pitches";
import { CalendarToday, LocationOn } from "@mui/icons-material";
import { Box, Card, Stack, Typography } from "@mui/material";
import Image from "next/image";

interface Props {
  area: string;
}

const MAX_SUGGESTIONS = 4;

export default function MatchScheduleSuggestion({ area }: Props) {
  const isEn = useLocalization() === "EN";

  const pitches = useSuggestPitches(area, MAX_SUGGESTIONS);

  if (pitches.length <= 0) {
    return null;
  }

  const suggestions = pitches.slice(
    0,
    Math.min(pitches.length, MAX_SUGGESTIONS),
  );

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack
        sx={{
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Stack
          sx={() => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 0.5,
            justifyContent: "flex-start",
          })}
        >
          <CalendarToday
            color="primary"
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              fontSize: 18,
              marginRight: 0.5,
            }}
          />
          <Typography variant="h6">
            {area
              ? isEn
                ? `Schedule a match in ${area}`
                : `Marca um jogo em ${area}`
              : isEn
                ? `Schedule a match `
                : `Marca um jogo`}
          </Typography>
        </Stack>

        <Typography variant="caption">
          {isEn ? "Choose a pitch to start" : "Escolhe um campo para começar"}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: `repeat(${MAX_SUGGESTIONS}, minmax(0, 1fr))`,
          },
          gap: 2,
          mt: 2,
        }}
      >
        {suggestions.map((pitch) => (
          <MatchScheduleSuggestionItem pitch={pitch} key={pitch.id} />
        ))}
      </Box>
    </Card>
  );
}

const MatchScheduleSuggestionItem = ({ pitch }: { pitch: Pitch }) => {
  return (
    <Card
      sx={{
        flex: `1 1 0`,
        minWidth: 0,
        width: {
          xs: "100%",
          md: "auto",
        },
        p: 0,
      }}
      variant="outlined"
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 /1",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <Image
          src={pitch.image_url!}
          alt={pitch.image_url!}
          fill
          sizes="(max-width: 600px) 100vw 50vw"
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      <Stack
        sx={{ flexDirection: "column", justifyContent: "space-between", p: 1 }}
      >
        <Typography variant="button">{pitch.name}</Typography>

        <Stack sx={{ flexDirection: "row", gap: 0.5, alignItems: "center" }}>
          <LocationOn sx={{ fontSize: 14, opacity: 0.75 }} />
          <Typography variant="body2" color="textSecondary">
            {pitch.municipality}, {pitch.area}
          </Typography>
        </Stack>

        <Stack sx={{ alignSelf: "flex-end" }}>
          <ScheduleMatchButton
            isSmall
            selectedArea={pitch.area}
            onAddPitch={() => {}}
            selectedPitch={pitch.id.toString()}
          />
        </Stack>
      </Stack>
    </Card>
  );
};
