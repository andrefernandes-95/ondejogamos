"use client";

import { playerPositions } from "@/app/models/player-profile";
import type { PlayerProfileEditingPayload } from "@/app/models/player-profile";
import { updatePlayerProfile } from "@/app/utils/player-profile-api";
import { playerProfileSchema } from "@/app/validations/player-profile";
import type { PlayerProfileInput } from "@/app/validations/player-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import UploadImageInput from "@/app/components/upload-image-input/upload-image-input";

const profileFormSchema = playerProfileSchema.extend({ avatar: z.custom<File | null>() });
type ProfileFormValues = PlayerProfileInput & { avatar: File | null };

interface EditPlayerProfileDialogProps {
  initialProfile: PlayerProfileEditingPayload;
  areas: string[];
  onClose: () => void;
  onSaved: (profile: PlayerProfileEditingPayload) => void;
}

export function EditPlayerProfileDialog({ initialProfile, areas, onClose, onSaved }: EditPlayerProfileDialogProps) {
  const t = useTranslations();
  const formId = "edit-player-profile-form";
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialProfile.name,
      date_of_birth: initialProfile.date_of_birth,
      preferred_area: initialProfile.preferred_area,
      preferred_position: initialProfile.preferred_position,
      avatar: null,
    },
  });

  async function saveProfile(values: ProfileFormValues) {
    const { avatar, ...profileValues } = values;
    const result = await updatePlayerProfile(profileValues, avatar);
    if (result.ok) {
      onSaved(result.profile);
      return;
    }
    setError("root.server", { type: "server", message: result.errorCode });
  }

  const selectedAvatar = useWatch({ control, name: "avatar" });

  function closeIfIdle() {
    if (!isSubmitting) {
      onClose();
    }
  }

  return (
    <Dialog open onClose={closeIfIdle} fullWidth maxWidth="xs">
      <DialogTitle>{t("App.PlayerProfile.edit_profile")}</DialogTitle>
      <Box component="form" id={formId} onSubmit={handleSubmit(saveProfile)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {errors.root?.server?.message && (
              <Alert severity="error">{t(`ApiErrors.${errors.root.server.message}`)}</Alert>
            )}
            <Controller
              name="avatar"
              control={control}
              render={({ field, fieldState }) => (
                <UploadImageInput
                  value={selectedAvatar ?? null}
                  currentImageUrl={initialProfile.image}
                  onChange={field.onChange}
                  errorMessage={fieldState.error?.message}
                  shape="circle"
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  inputRef={field.ref}
                  label={t("App.PlayerProfile.display_name")}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error ? t("App.PlayerProfile.invalid_display_name") : undefined}
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="date_of_birth"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || null)}
                  inputRef={field.ref}
                  label={t("App.PlayerProfile.date_of_birth")}
                  type="date"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error ? t("App.PlayerProfile.invalid_date_of_birth") : undefined}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
              )}
            />
            <Controller
              name="preferred_area"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || null)}
                  inputRef={field.ref}
                  select
                  label={t("App.PlayerProfile.preferred_area")}
                  fullWidth
                >
                  <MenuItem value="">{t("App.PlayerProfile.not_set")}</MenuItem>
                  {areas.map((area) => <MenuItem key={area} value={area}>{area}</MenuItem>)}
                </TextField>
              )}
            />
            <Controller
              name="preferred_position"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || null)}
                  inputRef={field.ref}
                  select
                  label={t("App.PlayerProfile.preferred_position")}
                  fullWidth
                >
                  <MenuItem value="">{t("App.PlayerProfile.not_set")}</MenuItem>
                  {playerPositions.map((position) => (
                    <MenuItem key={position} value={position}>
                      {t(`App.PlayerProfile.positions.${position}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeIfIdle} disabled={isSubmitting}>{t("App.PlayerProfile.cancel")}</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {t("App.PlayerProfile.save")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
