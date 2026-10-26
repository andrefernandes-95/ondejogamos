"use client";

import MunicipalitySelector from "@/app/components/municipality-selector/municipality-selector";
import UploadImageInput from "@/app/components/upload-image-input/upload-image-input";
import useLocalization from "@/app/hooks/locale";
import { Pitch } from "@/app/services/pitches";
import { REQUIRED_FIELD } from "@/app/utils/constants";
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

interface Props {
  selectedArea: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingPitch?: Pitch;
  onUpdatePitch?: () => void;
}

const formId = "create-pitch-form";

const getSchema = (isEn: boolean) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, isEn ? REQUIRED_FIELD : "Nome do campo obrigatório"),
    area: z
      .string()
      .trim()
      .min(1, isEn ? REQUIRED_FIELD : "Área obrigatória"),
    municipality: z
      .string()
      .trim()
      .min(1, isEn ? REQUIRED_FIELD : "Município obrigatório"),
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
      }, "URL do mapa inválido"),
    photo: z
      .instanceof(File, {
        message: isEn ? "Choose a photo" : "Escolhe uma fotografia",
      })
      .refine((file) => file.size > 0, isEn ? "Empty file" : "Ficheiro vazio")
      .refine(
        (file) => file.size <= MAX_IMAGE_SIZE,
        isEn
          ? `Maximum ${MAX_IMAGE_SIZE_IN_MB} MB`
          : `Máximo de ${MAX_IMAGE_SIZE_IN_MB} MB`,
      )
      .refine(
        (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
        isEn ? "Use JPEG or PNG" : "Usa JPEG ou PNG",
      )
      .nullable(),
  });

type FormValues = z.infer<ReturnType<typeof getSchema>>;

export default function CreatePitchModal({
  open,
  setOpen,
  selectedArea,
  existingPitch,
  onUpdatePitch,
}: Props) {
  const [municipalitiesForArea, setMunicipalitiesForArea] = useState<string[]>(
    [],
  );

  const isEn = useLocalization() === "EN";

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getSchema(isEn)),
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
          isEn
            ? "Failed to load municipalities"
            : "Falha ao carregar municípios",
        );
      }

      const municipalities = await response.json();

      setMunicipalitiesForArea(municipalities);
    };
    fetchMunicipalitiesForArea();
  }, [
    // Run every time the area changes
    selectedArea,
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
          message: isEn
            ? "Could not save pitch"
            : "Não foi possível guardar o campo",
        });
        return;
      }

      reset();
      setOpen(false);
      window.location.reload();
    } catch {
      setError("root.server", {
        message: isEn
          ? "Could not save pitch"
          : "Não foi possível guardar o campo",
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
          {isEn ? "Add Pitch" : "Adicionar Campo"}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {isEn
            ? `Add a new pitch to ${selectedArea}`
            : `Adiciona um novo campo a ${selectedArea}`}
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
                  label={isEn ? "Pitch Name" : "Nome do campo"}
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
              name="maps_url"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="url"
                  inputRef={field.ref}
                  label={isEn ? "Google Maps URL" : "URL do Google Maps"}
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
          {isEn ? "Cancel" : "Cancelar"}
        </Button>

        <Button
          type="submit"
          form={formId}
          variant="contained"
          disabled={isSubmitting}
        >
          {existingPitch
            ? isEn
              ? "Save Changes"
              : "Guardar Alterações"
            : isEn
              ? "Add"
              : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
