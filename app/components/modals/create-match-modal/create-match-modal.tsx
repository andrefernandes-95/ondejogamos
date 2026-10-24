"use client";

import CreateMatchFields from "@/app/components/modals/create-match-modal/create-match-fields";
import { useListPitchesForArea } from "@/app/hooks/pitches";
import { FullMatch } from "@/app/models/match";
import { CreateMatchFormValues, createMatchSchema } from "@/app/schemas/match";
import { readApiErrorCode } from "@/app/utils/api-error";
import { toMatchFormData } from "@/app/utils/match-form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface Props {
  selectedArea: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingMatch?: FullMatch;
  onAddPitch?: () => void;
  onSaved?: () => void;
  selectedPitch?: string;
}

const formId = "create-pitch-form";

export default function CreateMatchModal({
  open,
  setOpen,
  selectedArea,
  selectedPitch,
  existingMatch,
  onAddPitch,
  onSaved,
}: Props) {
  const tApp = useTranslations();
  const router = useRouter();
  const tErrors = useTranslations("ApiErrors");

  const {
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateMatchFormValues>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      description: existingMatch ? existingMatch.description : "",
      pitchId: selectedPitch
        ? selectedPitch
        : existingMatch
          ? existingMatch.pitch.id?.toString()
          : "",
      durationInMinutes: existingMatch
        ? Number(existingMatch.duration_in_minutes)
        : 60,
      startsAt: existingMatch ? existingMatch.starts_at?.toISOString() : "",
      format: existingMatch ? existingMatch.format : "5x5",
      minAttendance: existingMatch ? existingMatch.min_attendance : 10,
    },
  });

  const {
    pitches,
    loading: pitchesLoading,
    error: pitchesError,
    retry,
  } = useListPitchesForArea(selectedArea);

  const actionLabels = {
    cancel: tApp("App.CreateMatchModal.cancel"),
    addPitch: tApp("App.CreatePitchModal.add_pitch"),
    save: tApp("App.CreateMatchModal.save_changes"),
    schedule: tApp("Match.schedule"),
  };

  const isPitchListEmpty = !pitchesLoading && !pitchesError && pitches.length === 0;
  const canSubmit = !pitchesLoading && !pitchesError && pitches.length > 0;

  const onSubmit = async (values: CreateMatchFormValues) => {
    try {
      const response = await fetch(`/api/matches`, {
        method: existingMatch ? "PUT" : "POST",
        body: toMatchFormData(values, existingMatch?.id),
      });

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const code = readApiErrorCode(payload);

        setError("root.server", {
          message: tErrors(code),
        });
        return;
      }

      reset();
      setOpen(false);
      onSaved?.();
      router.refresh();
    } catch {
      setError("root.server", {
        message: tErrors("INTERNAL_ERROR"),
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
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
        <Typography variant="h5">
          {tApp("App.CreateMatchModal.title", { area: selectedArea })}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 2, gap: 2 }}>
            {errors.root?.server?.message && (
              <Alert severity="error" role="alert">
                {errors.root.server.message}
              </Alert>
            )}
            {pitchesLoading && (
              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}
              >
                <CircularProgress size={20} />
                <Typography>
                  {tApp("App.CreateMatchModal.loading_pitches")}
                </Typography>
              </Stack>
            )}
            {pitchesError && (
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={retry}>
                    {tApp("App.CreateMatchModal.retry")}
                  </Button>
                }
              >
                {tApp("App.CreateMatchModal.could_not_load_pitches_try_again")}
              </Alert>
            )}
            {isPitchListEmpty && (
              <Typography>
                {tApp("App.CreateMatchModal.no_pitches", { area: selectedArea })}
              </Typography>
            )}
            {!pitchesLoading && !pitchesError && pitches.length > 0 && (
              <CreateMatchFields
                control={control}
                setValue={setValue}
                pitches={pitches}
                existingMatch={existingMatch}
              />
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>{actionLabels.cancel}</Button>

        {canSubmit && (
          <Button
            type="submit"
            form={formId}
            variant="contained"
            disabled={isSubmitting}
          >
            {existingMatch ? actionLabels.save : actionLabels.schedule}
          </Button>
        )}
        {isPitchListEmpty && (
          <Button
            onClick={() => {
              setOpen(false);
              onAddPitch?.();
            }}
            variant="contained"
          >
            {actionLabels.addPitch}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
