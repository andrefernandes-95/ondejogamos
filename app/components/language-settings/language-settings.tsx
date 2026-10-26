"use client";

import useLocalization from "@/app/hooks/locale";
import { IconButton, Stack } from "@mui/material";
import React from "react";

export default function LanguageSettings() {
  const change = (nextLocale: string) => {
    document.cookie = `locale=${nextLocale}; Path=/; Max-Age:31536000; Same-Site=Lax`;
    window.location.reload();
  };

  const iEn = useLocalization() === "EN";

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
        isActive={iEn === false}
        change={change}
        code="pt-PT"
        ariaLabel="Português"
      >
        <>🇵🇹</>
      </RenderFlagButton>
      <RenderFlagButton
        isActive={iEn}
        change={change}
        code="en"
        ariaLabel="English"
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
    }}
    aria-label={ariaLabel}
  >
    {children}
  </IconButton>
);
