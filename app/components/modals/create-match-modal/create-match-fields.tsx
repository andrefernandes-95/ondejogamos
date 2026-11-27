"use client";

import MatchDatePicker from "@/app/components/match-date-picker/match-date-picker";
import MatchFormatInput from "@/app/components/match-format-input/match-format-input";
import MatchDurationInput from "@/app/components/match-duration-input/match-duration-input";
import PitchSelector from "@/app/components/pitch-selector/pitch-selector";
import { FullMatch } from "@/app/models/match";
import { CreateMatchFormValues } from "@/app/schemas/match";
import { Pitch } from "@/app/services/pitches";
import { minimumPlayersByFormat } from "@/app/utils/home-schedule";
import { Stack, TextField, Typography } from "@mui/material";
import { Control, Controller, UseFormSetValue, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

interface Props {
  control: Control<CreateMatchFormValues>;
  setValue: UseFormSetValue<CreateMatchFormValues>;
  pitches: Pitch[];
  existingMatch?: FullMatch;
  fixedSlot?: boolean;
}

export default function CreateMatchFields({
  control,
  setValue,
  pitches,
  existingMatch,
  fixedSlot,
}: Props) {
  const tApp = useTranslations();
  const pitchId = useWatch({ control, name: "pitchId" });
  const duration = useWatch({ control, name: "durationInMinutes" });

  return (
    <>
      {!fixedSlot && <Controller
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
      />}
      {!fixedSlot && <MatchFormatInput
        control={control}
        onChange={(format) => {
          setValue("minAttendance", minimumPlayersByFormat[format], {
            shouldDirty: true,
          });
        }}
      />}
      {!fixedSlot && <Controller
        name="durationInMinutes"
        control={control}
        render={({ field, fieldState }) => (
          <MatchDurationInput name={field.name} onBlur={field.onBlur} inputRef={field.ref}
            value={String(field.value ?? "")} onChange={field.onChange} error={fieldState.error?.message} />
        )}
      />}
      {!fixedSlot && <Controller
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
      />}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            multiline
            type="text"
            label={tApp("App.CreateMatchModal.observations")}
            helperText={fieldState.error?.message}
            error={!!fieldState.error}
          />
        )}
      />
    </>
  );
}
