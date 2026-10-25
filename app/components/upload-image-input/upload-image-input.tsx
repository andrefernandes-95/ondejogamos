"use client";

import { CloudUpload, Delete } from "@mui/icons-material";
import { Box, Button, FormHelperText, Stack } from "@mui/material";
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

  return (
    <Stack spacing={1}>
      {previewUrl && (
        <Box
          component="img"
          src={previewUrl}
          alt=""
          sx={{
            width: isCircle ? 72 : "100%",
            height: isCircle ? 72 : 180,
            borderRadius: isCircle ? "50%" : 1,
            objectFit: "cover",
          }}
        />
      )}
      <Stack direction="row" spacing={1}>
        <Button
          component="label"
          variant="outlined"
          tabIndex={-1}
          startIcon={<CloudUpload />}
        >
          {previewUrl ? t("change_image") : t("upload_image")}
          <input
            hidden
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              onChange(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />
        </Button>
        {value && (
          <Button onClick={() => onChange(null)} startIcon={<Delete />}>
            {t("remove_selected_image")}
          </Button>
        )}
      </Stack>
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </Stack>
  );
}
