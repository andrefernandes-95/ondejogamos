"use client";

import { useTranslations } from "next-intl";

import { IconButton, Stack } from "@mui/material";

export default function LanguageSettings() {
  const t = useTranslations();
  const change = (nextLocale: string) => {
    document.cookie = `locale=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.reload();
  };
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        p: 1,
      }}
    >
      <IconButton
        onClick={() => change("pt-PT")}
        sx={{ color: "white" }}
        aria-label={t("Language.portuguese")}
      >
        🇵🇹
      </IconButton>
      <IconButton
        onClick={() => change("en")}
        sx={{ color: "white" }}
        aria-label={t("Language.english")}
      >
        🇬🇧
      </IconButton>
    </Stack>
  );
}
