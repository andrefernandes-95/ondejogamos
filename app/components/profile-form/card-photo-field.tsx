"use client";

import { DeleteOutlined, PhotoCameraOutlined } from "@mui/icons-material";
import { Avatar, Button, IconButton, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface Props {
  portrait: string | null;
  choosePhoto: (photo: File | null) => void;
}

export default function CardPhotoField({ portrait, choosePhoto }: Props) {
  const t = useTranslations("App.PlayerCard");
  return (
    <Stack direction="row" spacing={1.5} sx={{
      alignItems: "center", p: 1.5, border: 1, borderColor: "divider", borderRadius: "12px",
    }}>
      <Avatar src={portrait ?? undefined} sx={{ bgcolor: "primary.main" }} />
      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Button component="label" variant="text" startIcon={<PhotoCameraOutlined />}
          sx={{
            alignSelf: "flex-start", justifyContent: "flex-start", px: 0.5,
            "&:focus-within": { outline: "2px solid", outlineColor: "primary.main" },
          }}>
          {t(portrait ? "change_photo" : "choose_photo")}
          <input type="file" accept="image/jpeg,image/png,image/webp" aria-label={t("upload_photo")}
            style={{ width: 1, height: 1, clipPath: "inset(50%)", position: "absolute", overflow: "hidden" }}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) choosePhoto(file);
              event.currentTarget.value = "";
            }} />
        </Button>
        <Typography variant="caption" color="text.secondary">{t("photo_hint")}</Typography>
        <Typography variant="caption" color="text.secondary">{t("photo_recommendation")}</Typography>
      </Stack>
      {portrait && (
        <IconButton aria-label={t("remove_photo")} onClick={() => choosePhoto(null)}>
          <DeleteOutlined />
        </IconButton>
      )}
    </Stack>
  );
}
