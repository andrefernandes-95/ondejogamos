"use client";

import { CloudUpload, Delete, PhotoCamera } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

interface Props {
  value: File | null;
  onChange: (file: File | null) => void;
  errorMessage?: string;
  currentImageUrl?: string | null;
  shape?: "circle" | "rectangle";
}

export default function UploadImageInput({
  value,
  onChange,
  errorMessage,
  currentImageUrl,
  shape = "rectangle",
}: Props) {
  const t = useTranslations("App.UploadImageInput");
  const selectedPreview = useMemo(() => {
    if (!value) {
      return null;
    }
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (selectedPreview) {
        URL.revokeObjectURL(selectedPreview);
      }
    };
  }, [selectedPreview]);

  const previewUrl = selectedPreview ?? currentImageUrl;
  const isCircle = shape === "circle";

  if (isCircle) {
    return (
      <Stack spacing={0.5} sx={{ alignItems: "center", py: 1 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={previewUrl ?? undefined}
            alt=""
            sx={{
              width: 104,
              height: 104,
              border: "4px solid",
              borderColor: "background.paper",
              boxShadow: 2,
            }}
          />
          <Tooltip title={t("change_image")}>
            <IconButton
              component="label"
              aria-label={t("change_image")}
              size="small"
              sx={{
                position: "absolute",
                right: -4,
                bottom: -4,
                color: "primary.contrastText",
                bgcolor: "primary.main",
                border: "3px solid",
                borderColor: "background.paper",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <PhotoCamera fontSize="small" />
              <ImageFileInput onChange={onChange} />
            </IconButton>
          </Tooltip>
        </Box>
        {value && (
          <Button onClick={() => onChange(null)} size="small">
            {t("remove_selected_image")}
          </Button>
        )}
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Stack spacing={1}>
        {previewUrl && (
          <Box
            component="img"
            src={previewUrl}
            alt=""
            sx={{
              width: "100%",
              height: 180,
              borderRadius: 1,
              objectFit: "cover",
            }}
          />
        )}
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Button
            component="label"
            variant="outlined"
            size="small"
            tabIndex={-1}
            startIcon={<CloudUpload />}
          >
            {previewUrl ? t("change_image") : t("upload_image")}
            <ImageFileInput onChange={onChange} />
          </Button>
          {value && (
            <Button
              onClick={() => onChange(null)}
              size="small"
              startIcon={<Delete />}
            >
              {t("remove_selected_image")}
            </Button>
          )}
        </Stack>
      </Stack>
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </Stack>
  );
}

function ImageFileInput({ onChange }: Pick<Props, "onChange">) {
  return (
    <input
      hidden
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={(event) => {
        onChange(event.target.files?.[0] ?? null);
        event.target.value = "";
      }}
    />
  );
}
