"use client";

import { IconButton, Stack } from "@mui/material";

export default function LanguageSettings() {
  const change = (nextLocale: string) => {
    document.cookie = `locale=${nextLocale}; Path=/; Max-Age:31536000; Same-Site=Lax`;
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
        aria-label="Português"
      >
        🇵🇹
      </IconButton>
      <IconButton
        onClick={() => change("en")}
        sx={{ color: "white" }}
        aria-label="English"
      >
        🇬🇧
      </IconButton>
    </Stack>
  );
}
