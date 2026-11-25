"use client";

import CreateMatchFields from "@/app/components/modals/create-match-modal/create-match-fields";
import { useListPitchesForArea } from "@/app/hooks/pitches";
import { FullMatch } from "@/app/models/match";
import { CreateMatchFormValues, createMatchSchema } from "@/app/schemas/match";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { authUrl } from "@/app/utils/auth-return";
import { AppRoutes } from "@/app/utils/routes";
import { formatMatchDate } from "@/app/utils/match-date";
import { getMatchFormDefaults, toMatchFormData } from "@/app/utils/match-form-data";
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
import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";

interface Props {
  selectedArea: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingMatch?: FullMatch;
  template?: FullMatch;
  onCreated?: (matchId: string) => void;
  onAddPitch?: () => void;
  selectedPitch?: string;
  slot?: { pitchId: string; name: string; municipality: string; startsAt: string };
  authReturnTo?: string;
}

export default function CreateMatchModal({
  open,
  setOpen,
  selectedArea,
  selectedPitch,
  existingMatch,
  template,
  onCreated,
  onAddPitch,
  slot,
  authReturnTo,
}: Props) {
  const tApp = useTranslations();
  const tErrors = useTranslations("ApiErrors");
  const tSchedule = useTranslations("App.HomeSchedule");
  const locale = useLocale();
  const formId = useId();
  const date = slot && formatMatchDate(new Date(slot.startsAt), locale, true);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateMatchFormValues>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: getMatchFormDefaults({
      existingMatch, template, selectedPitch: slot?.pitchId ?? selectedPitch, selectedStart: slot?.startsAt,
    }),
  });

  const {
    pitches,
    loading: pitchesLoading,
    error: pitchesError,
    retry,
  } = useListPitchesForArea(selectedArea, !slot);

  const actionLabels = {
    cancel: tApp("App.CreateMatchModal.cancel"),
    addPitch: tApp("App.CreatePitchModal.add_pitch"),
    save: tApp("App.CreateMatchModal.save_changes"),
    schedule: tApp("Match.schedule"),
  };

  const isPitchListEmpty = !slot && !pitchesLoading && !pitchesError && pitches.length === 0;
  const canSubmit = !authReturnTo && (Boolean(slot) || (!pitchesLoading && !pitchesError && pitches.length > 0));

  const onSubmit = async (values: CreateMatchFormValues) => {
    try {
      const response = await fetch(`/api/matches`, {
        method: existingMatch ? "PUT" : "POST",
        body: toMatchFormData(values, existingMatch?.id),
      });

      if (!response.ok) {
        const code = await readApiErrorCodeFromResponse(response);

        setError("root.server", {
          message: tErrors(code),
        });
        return;
      }

      reset();
      setOpen(false);
      if (!existingMatch && onCreated) {
        const created = await response.json().catch(() => null);
        if (typeof created?.id === "string" && /^[1-9]\d*$/.test(created.id)) {
          onCreated(created.id);
          return;
        }
      }
      window.location.reload();
    } catch {
      setError("root.server", {
        message: tErrors("INTERNAL_ERROR"),
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => { if (!isSubmitting) { setOpen(false); } }} fullWidth
      aria-labelledby={`${formId}-title`}>
      <DialogTitle
        id={`${formId}-title`}
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
        <Typography component="span" variant="h5">
          {slot ? tSchedule("confirm_title") : tApp("App.CreateMatchModal.title", { area: selectedArea })}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 2, gap: 2 }}>
            {slot && date && (
              <Stack sx={{ p: 2, bgcolor: "action.hover", borderLeft: 3, borderColor: "primary.main" }}>
                <Typography sx={{ fontWeight: 750 }}>{slot.name}</Typography>
                <Typography>{slot.municipality}, {selectedArea}</Typography>
                <Typography>{date.day} · {date.time}</Typography>
              </Stack>
            )}
            {authReturnTo && <Typography>{tSchedule("sign_in_to_confirm")}</Typography>}
            {slot && errors.startsAt && <Alert severity="error">{tSchedule("invalid_time")}</Alert>}
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
                {pitchesError}
              </Alert>
            )}
            {isPitchListEmpty && (
              <Typography>
                {tApp("App.CreateMatchModal.no_pitches", { area: selectedArea })}
              </Typography>
            )}
            {canSubmit && (
              <CreateMatchFields
                control={control}
                setValue={setValue}
                pitches={pitches}
                existingMatch={existingMatch}
                fixedSlot={Boolean(slot)}
              />
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} onClick={() => setOpen(false)}>{actionLabels.cancel}</Button>
        {authReturnTo && (
          <>
            <Button href={authUrl(AppRoutes.SIGN_UP, authReturnTo)}>{tApp("App.AuthNavbar.create_account")}</Button>
            <Button variant="contained" href={authUrl(AppRoutes.LOGIN, authReturnTo)}>{tSchedule("sign_in")}</Button>
          </>
        )}

        {canSubmit && (
          <Button
            type="submit"
            form={formId}
            variant="contained"
            disabled={isSubmitting}
          >
            {slot ? tSchedule("confirm_schedule") : existingMatch ? actionLabels.save : actionLabels.schedule}
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
