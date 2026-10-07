import { CreateMatchFormValues } from "@/app/schemas/match";
import {
  FormGroup,
  FormLabel,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<CreateMatchFormValues>;
  onChange: (format: string) => void;
}

export default function MatchFormatInput({ control, onChange }: Props) {
  return (
    <Controller
      name="format"
      control={control}
      render={({ field, fieldState }) => {
        const labelId = "match-format-label";
        const groupId = "match-format";
        return (
          <Stack sx={{ flexDirection: "column" }}>
            <FormGroup>
              <FormLabel id={labelId} color="primary">
                Formato de Jogo
              </FormLabel>
              <ToggleButtonGroup
                id={groupId}
                value={field.value}
                exclusive
                onChange={(_, value) => {
                  if (!value) {
                    return;
                  }
                  field.onChange(value);
                  onChange?.(value);
                }}
                onBlur={field.onBlur}
                aria-labelledby={labelId}
              >
                <ToggleButton value="5x5">5x5</ToggleButton>
                <ToggleButton value="7x7">7x7</ToggleButton>
                <ToggleButton value="11x11">11x11</ToggleButton>
              </ToggleButtonGroup>

              {fieldState?.error && (
                <Typography color="error">
                  {fieldState?.error?.message}
                </Typography>
              )}
            </FormGroup>
          </Stack>
        );
      }}
    />
  );
}
