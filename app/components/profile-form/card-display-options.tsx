"use client";

import { cardFields, type CardSettings } from "@/app/models/player-card";
import { Box, Checkbox, Divider, FormControl, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import CardEditorSection from "./card-editor-section";

interface Props {
  settings: CardSettings;
  onChange: (settings: CardSettings) => void;
}

export default function CardDisplayOptions({ settings, onChange }: Props) {
  const t = useTranslations("App.PlayerCard");
  return (
    <Stack spacing={2.25} divider={<Divider />}>
      <CardEditorSection title={t("visibility")}>
        <FormControl component="fieldset" aria-label={t("visibility")}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
            {cardFields.map((field) => (
              <FormControlLabel key={field} label={t(field)} sx={{ mr: 0 }} control={
                <Checkbox size="small" checked={settings.visible.includes(field)} onChange={(_, checked) => onChange({
                  ...settings,
                  visible: checked ? [...settings.visible, field] : settings.visible.filter((item) => item !== field),
                })} />
              } />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">{t("played_explanation")}</Typography>
        </FormControl>
      </CardEditorSection>
      <CardEditorSection title={t("publication")}>
        <FormControlLabel sx={{ m: 0, width: "100%", justifyContent: "space-between" }} labelPlacement="start"
          label={t("publish")}
          control={<Switch color="success" checked={settings.published} onChange={(_, published) => onChange({
            ...settings, published,
          })} />}
        />
        <Typography variant="caption" color="text.secondary" component="p">{t("publish_note")}</Typography>
      </CardEditorSection>
    </Stack>
  );
}
