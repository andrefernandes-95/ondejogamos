"use client";

import MunicipalitySelector from "@/app/components/municipality-selector/municipality-selector";
import UploadImageInput from "@/app/components/upload-image-input/upload-image-input";
import { Pitch } from "@/app/services/pitches";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_IN_MB,
} from "@/app/utils/image";
import { zodResolver } from "@hookform/resolvers/zod";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Alert,
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
import { useTranslations } from "next-intl";

interface Props {
  selectedArea: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingPitch?: Pitch;
  onUpdatePitch?: () => void;
}

const formId = "create-pitch-form";

const getSchema = (messages: {
  requiredName: string;
  requiredArea: string;
  requiredMunicipality: string;
  invalidMapsUrl: string;
  choosePhoto: string;
  emptyFile: string;
  maxFileSize: (size: number) => string;
  imageType: string;
}) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.requiredName),
    area: z
      .string()
      .trim()
      .min(1, messages.requiredArea),
    municipality: z
      .string()
      .trim()
      .min(1, messages.requiredMunicipality),
    image_url: z.string().trim().nullable().optional(),
    maps_url: z
      .string()
      .trim()
      .refine((value) => {
        if (value === "") {
          return true;
        }

        try {
          return ["http:", "https:"].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      }, messages.invalidMapsUrl),
    photo: z
      .instanceof(File, {
        message: messages.choosePhoto,
      })
      .refine((file) => file.size > 0, messages.emptyFile)
      .refine(
        (file) => file.size <= MAX_IMAGE_SIZE,
        messages.maxFileSize(MAX_IMAGE_SIZE_IN_MB),
      )
      .refine(
        (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
        messages.imageType,
      )
      .nullable(),
  });

type FormValues = z.infer<ReturnType<typeof getSchema>>;

export default function CreatePitchModal({
  open,
  setOpen,
  selectedArea,
  existingPitch,
}: Props) {
  const tApp = useTranslations();
  const [municipalitiesForArea, setMunicipalitiesForArea] = useState<string[]>(
    [],
  );

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      getSchema({
        requiredName: tApp("App.CreatePitchModal.required_name"),
        requiredArea: tApp("App.CreatePitchModal.required_area"),
        requiredMunicipality: tApp("App.CreatePitchModal.required_municipality"),
        invalidMapsUrl: tApp("App.CreatePitchModal.invalid_maps_url"),
        choosePhoto: tApp("App.CreatePitchModal.choose_a_photo"),
        emptyFile: tApp("App.CreatePitchModal.empty_file"),
        maxFileSize: (size) => tApp("App.CreatePitchModal.maximum_file_size", { size }),
        imageType: tApp("App.CreatePitchModal.use_jpeg_or_png"),
      }),
    ),
    defaultValues: {
      name: existingPitch ? existingPitch.name : "",
      area: existingPitch ? existingPitch.area : selectedArea,
      municipality: existingPitch ? existingPitch.municipality : "",
      maps_url: existingPitch ? existingPitch.maps_url : "",
      photo: null,
      image_url: existingPitch ? existingPitch.image_url : "",
    },
  });

  useEffect(() => {
    const fetchMunicipalitiesForArea = async () => {
      const response = await fetch(
        `/api/municipalities?area=${encodeURIComponent(selectedArea)}`,
      );

      if (!response.ok) {
        throw new Error(
          tApp("App.CreatePitchModal.failed_to_load_municipalities"),
        );
      }

      const municipalities = await response.json();

      setMunicipalitiesForArea(municipalities);
    };
    fetchMunicipalitiesForArea();
  }, [
    // Run every time the area changes
    selectedArea,
    tApp,
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  const submit = async (values: FormValues) => {
    const body = new FormData();

    console.log("existingPitch:", existingPitch);
    if (existingPitch) {
      body.append("id", existingPitch.id.toString());
    }

    body.append("name", values.name);
    body.append("area", values.area);
    body.append("municipality", values.municipality);
    body.append("maps_url", values.maps_url ?? "");

    if (values.photo) {
      body.append("image", values.photo);
    } else if (existingPitch?.image_url) {
      body.append("image_url", existingPitch?.image_url);
    }

    try {
      const response = await fetch(`/api/pitches`, {
        method: existingPitch ? "PUT" : "POST",
        body,
      });

      if (!response.ok) {
        setError("root.server", {
          message: tApp("App.CreatePitchModal.could_not_save_pitch"),
        });
        return;
      }

      reset();
      setOpen(false);
      window.location.reload();
    } catch {
      setError("root.server", {
        message: tApp("App.CreatePitchModal.could_not_save_pitch"),
      });
    }
  };

  const serverError = errors?.root?.server?.message;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle
        color="primary"
        sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}
      >
        <PlaceIcon />
        <Typography variant="h5">
          {tApp("App.CreatePitchModal.add_pitch")}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {tApp("App.CreatePitchModal.description", { area: selectedArea })}
        </DialogContentText>

        <Box
          component="form"
          id={formId}
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          {serverError && <Alert severity="error">{serverError}</Alert>}
          <Stack spacing={2} sx={{ py: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  inputRef={field.ref}
                  label={tApp("App.CreatePitchModal.pitch_name")}
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
                  currentImageUrl={existingPitch?.image_url}
                  errorMessage={
                    fieldState.error ? fieldState.error?.message : ""
                  }
                />
              )}
            />

            <Controller
              name="maps_url"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="url"
                  inputRef={field.ref}
                  label={tApp("App.CreatePitchModal.google_maps_url")}
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
          {tApp("App.CreatePitchModal.cancel")}
        </Button>

        <Button
          type="submit"
          form={formId}
          variant="contained"
          disabled={isSubmitting}
        >
          {existingPitch
            ? tApp("App.CreatePitchModal.save_changes")
            : tApp("App.CreatePitchModal.add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
