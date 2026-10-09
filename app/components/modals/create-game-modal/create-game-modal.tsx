"use client";

import MatchDatePicker from "@/app/components/date-picker/date-picker";
import DatePicker from "@/app/components/date-picker/date-picker";
import MatchFormatInput from "@/app/components/match-format-input/match-format-input";
import PitchSelector from "@/app/components/pitch-selector/pitch-selector";
import { useListPitchesForArea } from "@/app/hooks/pitches";
import { CreateMatchFormValues, createMatchSchema } from "@/app/schemas/match";
import { AppRoutes } from "@/app/utils/routes";
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
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

interface Props {
  selectedArea: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formId = "create-pitch-form";

export default function CreateGameModal({
  open,
  setOpen,
  selectedArea,
}: Props) {
  const router = useRouter();

  const { control, handleSubmit, setError, reset, setValue } =
    useForm<CreateMatchFormValues>({
      resolver: zodResolver(createMatchSchema),
      defaultValues: {
        description: "",
        pitchId: "",
        durationInMinutes: 60,
        startsAt: "",
        format: "5x5",
        minAttendance: 10,
      },
    });

  const pitches = useListPitchesForArea(selectedArea);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (values: CreateMatchFormValues) => {
    const body = new FormData();

    body.append("pitchId", values.pitchId);
    body.append("description", values.description!);
    body.append("durationInMinutes", "60");
    body.append("format", values.format);
    body.append("minAttendance", values.minAttendance.toString());
    body.append("startsAt", values.startsAt.toString());

    try {
      const response = await fetch(`/api/matches`, { method: "POST", body });

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
              name="startsAt"
              control={control}
              render={({ field, fieldState }) => (
                <Stack>
                  <MatchDatePicker
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
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
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>

        <Button type="submit" form={formId} variant="contained">
          Agendar Jogo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
