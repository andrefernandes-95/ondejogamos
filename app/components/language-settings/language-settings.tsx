"use client";

import { IconButton, Stack } from "@mui/material";
import React from "react";
import { useLocale, useTranslations } from "next-intl";

export default function LanguageSettings() {
  const locale = useLocale();
  const tApp = useTranslations();
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
        gap: 0.5,
      }}
    >
      <RenderFlagButton
        isActive={locale === "pt-PT"}
        change={change}
        code="pt-PT"
        ariaLabel={tApp("App.LanguageSettings.portuguese")}
      >
        <>🇵🇹</>
      </RenderFlagButton>
      <RenderFlagButton
        isActive={locale === "en"}
        change={change}
        code="en"
        ariaLabel={tApp("App.LanguageSettings.english")}
      >
        <>🇬🇧</>
      </RenderFlagButton>
    </Stack>
  );
}

const RenderFlagButton = ({
  code,
  children,
  change,
  ariaLabel,
  isActive,
}: {
  children: React.ReactNode;
  code: string;
  change: (value: string) => void;
  ariaLabel: string;
  isActive: boolean;
}) => (
  <IconButton
    onClick={() => change(code)}
    sx={{
      color: "white",
      width: 35,
      height: 35,
      border: isActive ? "1px solid currentColor" : "1px solid transparent",
    }}
    aria-label={ariaLabel}
    aria-pressed={isActive}
  >
    {children}
  </IconButton>
);
