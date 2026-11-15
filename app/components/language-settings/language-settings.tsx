"use client";

import { Button, Stack } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

const languages = [
  { code: "pt-PT", label: "PT", name: "portuguese" },
  { code: "en", label: "EN", name: "english" },
] as const;

function changeLanguage(code: (typeof languages)[number]["code"]) {
  document.cookie = `locale=${code}; Path=/; Max-Age:31536000; SameSite=Lax`;
  window.location.reload();
}

export default function LanguageSettings() {
  const locale = useLocale();
  const t = useTranslations("App.LanguageSettings");

  return (
    <Stack direction="row" spacing={0.5}>
      {languages.map(({ code, label, name }) => {
        const active = code === locale;
        return (
          <Button
            key={code}
            onClick={() => { if (!active) changeLanguage(code); }}
            variant={active ? "contained" : "text"}
            aria-label={t(name)}
            aria-pressed={active}
            size="small"
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            {label}
          </Button>
        );
      })}
    </Stack>
  );
}
