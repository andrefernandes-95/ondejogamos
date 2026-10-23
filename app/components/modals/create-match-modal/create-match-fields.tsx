"use client";

import MatchDatePicker from "@/app/components/match-date-picker/match-date-picker";
import MatchFormatInput from "@/app/components/match-format-input/match-format-input";
import PitchSelector from "@/app/components/pitch-selector/pitch-selector";
import useLocalization from "@/app/hooks/locale";
import { FullMatch } from "@/app/models/match";
import { CreateMatchFormValues } from "@/app/schemas/match";
import { Pitch } from "@/app/services/pitches";
import { Stack, TextField, Typography } from "@mui/material";
import { Control, Controller, UseFormSetValue, useWatch } from "react-hook-form";

interface Props {
  control: Control<CreateMatchFormValues>;
  setValue: UseFormSetValue<CreateMatchFormValues>;
  pitches: Pitch[];
  existingMatch?: FullMatch;
}

export default function CreateMatchFields({
  control,
  setValue,
  pitches,
  existingMatch,
}: Props) {
  const isEn = useLocalization() === "EN";
  const pitchId = useWatch({ control, name: "pitchId" });
  const duration = useWatch({ control, name: "durationInMinutes" });

  return (
    <>
      <Controller
        name="pitchId"
        control={control}
        render={({ field, fieldState }) => (
          <PitchSelector
            data={pitches}
            selectedPitch={field.value}
            handleSelectedPitch={(value) => field.onChange(value)}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <MatchFormatInput
        control={control}
        onChange={(format) => {
          const minimumPlayers = { "5x5": 10, "7x7": 14, "11x11": 22 };
          setValue("minAttendance", minimumPlayers[format as keyof typeof minimumPlayers], {
            shouldDirty: true,
          });
        }}
      />
      <Controller
        name="durationInMinutes"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type="number"
            label={isEn ? "Duration (Minutes)" : "Duração (Minutos)"}
            helperText={fieldState.error?.message}
            error={!!fieldState.error}
          />
        )}
      />
      <Controller
        name="startsAt"
        control={control}
        render={({ field, fieldState }) => (
          <Stack>
            <MatchDatePicker
              {...field}
              value={field.value}
              onChange={field.onChange}
              current_match_id={existingMatch?.id ?? ""}
              current_match_pitch_id={pitchId}
              current_match_duration_in_minutes={Number(duration)}
            />
            {fieldState.error && (
              <Typography color="error">{fieldState.error.message}</Typography>
            )}
          </Stack>
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            multiline
            type="text"
            label={isEn ? "Observations" : "Observações"}
            helperText={fieldState.error?.message}
            error={!!fieldState.error}
          />
        )}
      />
    </>
  );
}
