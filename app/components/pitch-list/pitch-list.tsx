import CreatePitchButton from "@/app/components/create-pitch-button/create-pitch-button";
import DeletePitch from "@/app/components/delete-pitch-button/delete-pitch-button";
import PitchUrlButton from "@/app/components/pitch-url-button/pitch-url-button";
import type { PitchFull } from "@/app/services/pitches";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import PitchRow from "./pitch-row";

export default function PitchList({ data, loading }: { data: PitchFull[]; loading?: boolean }) {
  const t = useTranslations("App.PitchList");
  const tSchedule = useTranslations("App.HomeSchedule");
  const locale = useLocale();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "Europe/Lisbon" });

  return (
    <>
      {loading && <CircularProgress size={24} aria-label={tSchedule("loading")} />}
      {!loading && data.length === 0 && <Typography color="text.secondary">{tSchedule("no_pitches")}</Typography>}
      {data.length > 0 && (
        <Stack component="ul" spacing={{ xs: 1.25, sm: 1.5 }} sx={{ m: 0, p: 0 }}>
          {data.map((pitch) => (
            <PitchRow key={pitch.id} heading="h2" name={pitch.name} locality={[pitch.municipality, pitch.area].filter(Boolean).join(", ")}
              image={pitch.image_url}
              details={
                <Stack direction="row" sx={{ flexWrap: "wrap", columnGap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t("date_added")} · {date.format(new Date(pitch.created_at))}
                  </Typography>
                  {pitch.created_by && <Typography variant="caption" color="text.secondary">{t("added_by")} · {pitch.created_by}</Typography>}
                  <Typography variant="caption" color="text.secondary">{t("games_scheduled")} · {pitch.game_count}</Typography>
                </Stack>
              }
              actions={(pitch.maps_url || pitch.is_creator) && <>
                {pitch.maps_url && <PitchUrlButton maps_url={pitch.maps_url} showLabel />}
                {pitch.is_creator && <PitchAction pitch={pitch} />}
              </>} />
          ))}
        </Stack>
      )}
    </>
  );
}

function PitchAction({ pitch }: { pitch: PitchFull }) {
  const [isCreatingPitch, setIsCreatingPitch] = useState(false);
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap" }}>
      <CreatePitchButton
        selectedArea={pitch.area}
        isCreatingPitch={isCreatingPitch}
        setIsCreatingPitch={setIsCreatingPitch}
        existingPitch={pitch}
        onUpdatePitch={() => window.location.reload()}
      />
      <DeletePitch pitch={pitch} />
    </Stack>
  );
}
