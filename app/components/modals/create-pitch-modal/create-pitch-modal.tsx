"use client";

import { useTranslations } from "next-intl";

import MunicipalitySelector from "@/app/components/municipality-selector/municipality-selector";
import UploadImageInput from "@/app/components/upload-image-input/upload-image-input";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_IN_MB,
} from "@/app/utils/image";
import { zodResolver } from "@hookform/resolvers/zod";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import type { ValidationTranslator } from "@/app/i18n/validation";

interface Props {
  selectedArea: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formId = "create-pitch-form";

const createSchema = (t: ValidationTranslator) => z.object({
  name: z.string(t("Validation.nameRequired")).trim().min(1, t("Validation.pitchName")),
  area: z.string(t("Validation.area")).trim().min(1, t("Validation.area")),
  municipality: z.string(t("Validation.municipality")).trim().min(1, t("Validation.municipality")),
  mapsUrl: z
    .string()
    .trim()
    .pipe(z.union([z.url(t("Validation.url")), z.literal("")]))
    .nullable()
    .optional(),
  photo: z
    .instanceof(File, { message: t("Validation.photo") })
    .refine((file) => file.size > 0, t("Validation.emptyFile"))
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      t("Validation.maxImageSize", { count: MAX_IMAGE_SIZE_IN_MB }),
    )
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      t("Validation.imageTypes"),
    )
    .nullable(),
});

type FormValues = z.infer<ReturnType<typeof createSchema>>;

export default function CreatePitchModal({
  open,
  setOpen,
  selectedArea,
}: Props) {
  const t = useTranslations();
  const [municipalitiesForArea, setMunicipalitiesForArea] = useState<string[]>(
    [],
  );

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createSchema(t)),
    defaultValues: {
      name: "",
      area: selectedArea,
      municipality: "",
      mapsUrl: "",
      photo: null,
    },
  });

  useEffect(() => {
    const fetchMunicipalitiesForArea = async () => {
      const response = await fetch(
        `/api/municipalities?area=${encodeURIComponent(selectedArea)}`,
      );

      if (!response.ok) {
        throw new Error(t("Common.loadMunicipalitiesError"));
      }

      const municipalities = await response.json();

      setMunicipalitiesForArea(municipalities);
    };
    fetchMunicipalitiesForArea();
  }, [
    // Run every time the area changes
    selectedArea,
    t,
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  const submit = async (values: FormValues) => {
    const body = new FormData();

    body.append("name", values.name);
    body.append("area", values.area);
    body.append("municipality", values.municipality);
    body.append("maps_url", values.mapsUrl ?? "");

    if (values.photo) {
      body.append("image", values.photo);
    }

    try {
      const response = await fetch(`/api/pitches`, { method: "POST", body });

      if (!response.ok) {
        setError("root.server", {
          message: t("Pitch.saveError"),
        });
        return;
      }

      reset();
      setOpen(false);
    } catch {
      setError("root.server", { message: t("Pitch.saveError") });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle
        color="primary"
        sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}
      >
        <PlaceIcon />
        <Typography variant="h5">{t("Pitch.add")}</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t("Pitch.addInArea", { area: selectedArea })}
        </DialogContentText>

        <Box
          component="form"
          id={formId}
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          <Stack spacing={2} sx={{ py: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  inputRef={field.ref}
                  label={t("Pitch.name")}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="municipality"
              control={control}
              render={({ field, fieldState }) => (
                <MunicipalitySelector
                  selectedMunicipality={field.value}
                  onMunicipalitySelected={(value) => field.onChange(value)}
                  data={municipalitiesForArea}
                  errorMessage={fieldState.error?.message ?? ""}
                />
              )}
            />

            <Controller
              name="photo"
              control={control}
              render={({ field, fieldState }) => (
                <UploadImageInput
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  errorMessage={
                    fieldState.error ? fieldState.error?.message : ""
                  }
                />
              )}
            />

            <Controller
              name="mapsUrl"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="url"
                  inputRef={field.ref}
                  label={t("Pitch.mapsUrl")}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {t("Common.cancel")}
        </Button>

        <Button
          type="submit"
          form={formId}
          variant="contained"
          disabled={isSubmitting}
        >
          {t("Pitch.addAction")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
