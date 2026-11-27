import ControlLabel from "@/app/components/control-label/control-label";
import { AccessTimeRounded } from "@mui/icons-material";
import { InputAdornment, MenuItem, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useId } from "react";
import type { TextFieldProps } from "@mui/material";

export default function MatchDurationInput({ value, onChange, presets, inputRef, name, onBlur, error }: {
  value: number | string;
  onChange: (value: string) => void;
  presets?: number[];
  inputRef?: TextFieldProps["inputRef"];
  name?: string;
  onBlur?: () => void;
  error?: string;
}) {
  const t = useTranslations("App.HomeSchedule");
  const id = useId();

  return (
    <Stack spacing={0.5}>
      <ControlLabel id={`${id}-label`} htmlFor={id}>{t("duration_label")}</ControlLabel>
      <TextField id={id} select={Boolean(presets)} type={presets ? undefined : "number"} name={name}
        value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur}
        inputRef={inputRef} error={Boolean(error)} helperText={error} sx={{ minWidth: 132 }}
        slotProps={{
          htmlInput: { min: 30 },
          select: { labelId: `${id}-label` },
          input: { startAdornment: (
            <InputAdornment position="start"><AccessTimeRounded fontSize="small" color="primary" /></InputAdornment>
          ) },
        }}>
        {presets?.map((duration) => <MenuItem key={duration} value={duration}>{t("minutes", { count: duration })}</MenuItem>)}
      </TextField>
    </Stack>
  );
}
