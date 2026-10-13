"use client";

import MatchDatePicker from "@/app/components/match-date-picker/match-date-picker";
import MatchFormatInput from "@/app/components/match-format-input/match-format-input";
import PitchSelector from "@/app/components/pitch-selector/pitch-selector";
import { useListPitchesForArea } from "@/app/hooks/pitches";
import { FullMatch } from "@/app/models/match";
import { CreateMatchFormValues, createMatchSchema } from "@/app/schemas/match";
import { zodResolver } from "@hookform/resolvers/zod";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

interface Props {
  selectedArea: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingMatch?: FullMatch;
  onAddPitch?: () => void;
}

const formId = "create-pitch-form";

export default function CreateMatchModal({
  open,
  setOpen,
  selectedArea,
  existingMatch,
  onAddPitch,
}: Props) {
  const { control, handleSubmit, setError, reset, setValue, watch } =
    useForm<CreateMatchFormValues>({
      resolver: zodResolver(createMatchSchema),
      defaultValues: {
        description: existingMatch ? existingMatch.description : "",
        pitchId: existingMatch ? existingMatch.pitch.id?.toString() : "",
        durationInMinutes: existingMatch
          ? Number(existingMatch.duration_in_minutes)
          : 60,
        startsAt: existingMatch ? existingMatch.starts_at?.toISOString() : "",
        format: existingMatch ? existingMatch.format : "5x5",
        minAttendance: existingMatch ? existingMatch.min_attendance : 10,
      },
    });

  const current_match_pitch_id = watch("pitchId");
  const current_match_duration_in_minutes = watch("durationInMinutes");

  const pitches = useListPitchesForArea(selectedArea);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (values: CreateMatchFormValues) => {
    const body = new FormData();

    if (existingMatch) {
      body.append("id", existingMatch.id);
    }

    body.append("pitchId", values.pitchId);
    body.append("description", values.description!);
    body.append(
      "durationInMinutes",
      values.durationInMinutes?.toString() ?? "60",
    );
    body.append("format", values.format);
    body.append("minAttendance", values.minAttendance.toString());
    body.append("startsAt", values.startsAt.toString());

    try {
      const response = await fetch(`/api/matches`, {
        method: existingMatch ? "PUT" : "POST",
        body,
      });

      if (!response.ok) {
        setError("root.server", {
          message: "Não foi possível agendar o jogo ",
        });
        return;
      }

      reset();
      setOpen(false);
      window.location.reload();
    } catch {
      setError("root.server", { message: "Não foi possível agendar o jogo " });
    }
  };

  const RenderForm = () =>
    pitches.length <= 0 ? (
      <></>
    ) : (
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
          onChange={(newValue) => {
            if (newValue === "5x5")
              setValue("minAttendance", 10, { shouldDirty: true });
            if (newValue === "7x7")
              setValue("minAttendance", 14, { shouldDirty: true });
            if (newValue === "11x11")
              setValue("minAttendance", 22, { shouldDirty: true });
          }}
        />

        <Controller
          name="durationInMinutes"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="number"
              label="Duração (Minutos)"
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
                current_match_id={existingMatch ? existingMatch.id : ""}
                current_match_pitch_id={current_match_pitch_id}
                current_match_duration_in_minutes={Number(
                  current_match_duration_in_minutes,
                )}
              />

              {fieldState?.error && (
                <Typography color="error">
                  {fieldState?.error?.message}
                </Typography>
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
              label="Observações"
              helperText={fieldState.error?.message}
              error={!!fieldState.error}
            />
          )}
        />
      </>
    );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle
        color="primary"
        sx={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 4,
        }}
      >
        <PlaceIcon />
        <Typography variant="h5">Agendar jogo em {selectedArea}</Typography>
      </DialogTitle>

      <DialogContent>
        <Box component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 2, gap: 2 }}>
            {pitches.length <= 0 && (
              <Typography>
                Parece que ainda não existem campos em {selectedArea}.
              </Typography>
            )}
            {RenderForm()}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>

        {pitches.length > 0 ? (
          <Button type="submit" form={formId} variant="contained">
            {existingMatch ? "Guardar alterações" : "Agendar Jogo"}
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                handleClose();
                onAddPitch?.();
              }}
              variant="contained"
            >
              Adicionar Campo
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
