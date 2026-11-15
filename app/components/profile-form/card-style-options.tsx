"use client";

import { StyleOutlined, WorkspacePremiumOutlined } from "@mui/icons-material";
import { Button, Stack, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import CardEditorSection from "./card-editor-section";

export default function CardStyleOptions({ founder, onChange }: {
  founder: boolean;
  onChange: (founder: boolean) => void;
}) {
  const t = useTranslations("App.PlayerCard");
  const pill = { borderRadius: 99, px: 2 };
  return (
    <CardEditorSection title={t("style")}>
      <Stack direction="row" role="group" aria-label={t("style")} sx={{ flexWrap: "wrap", gap: 1 }}>
        <Button variant={founder ? "outlined" : "contained"} aria-pressed={!founder}
          startIcon={<StyleOutlined />} sx={pill} onClick={() => onChange(false)}>
          {t("standard")}
        </Button>
        <Tooltip title={t("founder_hint")} describeChild arrow placement="top">
          <Button variant={founder ? "contained" : "outlined"} color="success" aria-pressed={founder}
            startIcon={<WorkspacePremiumOutlined />} sx={pill} onClick={() => onChange(true)}>
            {t("founder")}
          </Button>
        </Tooltip>
      </Stack>
    </CardEditorSection>
  );
}
