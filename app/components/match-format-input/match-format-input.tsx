import ControlLabel from "@/app/components/control-label/control-label";
import type { CreateMatchFormValues } from "@/app/schemas/match";
import { scheduleFormats } from "@/app/utils/home-schedule";
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { type Control, Controller } from "react-hook-form";

type Format = CreateMatchFormValues["format"];

export function MatchFormatPicker({ value, onChange, onBlur, error }: {
  value: Format;
  onChange: (format: Format) => void;
  onBlur?: () => void;
  error?: string;
}) {
  const t = useTranslations("App.MatchFormatInput");
  const labelId = useId();

  return (
    <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
      <ControlLabel id={labelId}>{t("match_format")}</ControlLabel>
      <ToggleButtonGroup exclusive value={value} aria-labelledby={labelId} onBlur={onBlur}
        onChange={(_, next: Format | null) => {
          if (next) {
            onChange(next);
          }
        }}>
        {scheduleFormats.map((format) => (
          <ToggleButton key={format} value={format}>{format.replace("x", "×")}</ToggleButton>
        ))}
      </ToggleButtonGroup>
      {error && <Typography color="error" variant="body2">{error}</Typography>}
    </Stack>
  );
}

export default function MatchFormatInput({ control, onChange }: {
  control: Control<CreateMatchFormValues>;
  onChange: (format: Format) => void;
}) {
  return (
    <Controller name="format" control={control} render={({ field, fieldState }) => (
      <MatchFormatPicker value={field.value} onBlur={field.onBlur} error={fieldState.error?.message}
        onChange={(format) => {
          field.onChange(format);
          onChange(format);
        }} />
    )} />
  );
}
