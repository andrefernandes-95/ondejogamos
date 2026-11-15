"use client";

import CardStage from "@/app/components/player-profile/card-stage";
import type { CardLabels } from "@/app/components/player-profile/player-profile";
import type { PlayerCardEditorData } from "@/app/models/player-card";
import { visibleCard } from "@/app/utils/player-card";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
  MenuItem, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import CardDisplayOptions from "./card-display-options";
import CardEditorSection from "./card-editor-section";
import CardPhotoField from "./card-photo-field";
import CardStyleOptions from "./card-style-options";
import CardUsernameField from "./card-username-field";
import { useCardDraft } from "./use-card-draft";

interface Props {
  data: PlayerCardEditorData;
  labels: CardLabels;
  onCancel: () => void;
  onSave: (data: PlayerCardEditorData) => void;
}

export default function ProfileForm({ data, labels, onCancel, onSave }: Props) {
  const t = useTranslations("App.PlayerCard");
  const errors = useTranslations("ApiErrors");
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { settings, setSettings, portrait, choosePhoto, pendingPhoto, save, busy, error } = useCardDraft(data);
  const areas = data.settings.area && !data.areas.includes(data.settings.area)
    ? [data.settings.area, ...data.areas] : data.areas;

  return (
    <Dialog open onClose={busy ? undefined : onCancel} fullWidth maxWidth="md" fullScreen={mobile}
      aria-labelledby="card-editor-title" slotProps={{ paper: { sx: { p: 0 } } }}>
      <DialogTitle id="card-editor-title" sx={{ fontWeight: 700, color: "primary.main" }}>
        {t("edit")}
      </DialogTitle>
      {error && <Alert severity="error" sx={{ mx: { xs: 2, sm: 3 }, mb: 2, flexShrink: 0 }}>
        {errors(error)}
      </Alert>}
      <DialogContent dividers sx={{ p: 0 }}>
        <Box component="form" id="player-card-form" noValidate onSubmit={async (event) => {
          event.preventDefault();
          const saved = await save();
          if (saved) onSave(saved);
        }} sx={{ display: "grid", gridTemplateColumns: { md: "minmax(230px, 2fr) minmax(0, 3fr)" } }}>
          <CardStage card={visibleCard({ ...data, settings, portrait })} labels={labels} preview={t("preview")} />
          <Box component="fieldset" disabled={busy} sx={(theme) => ({
            border: 0, m: 0, minWidth: 0, p: { xs: 2, sm: 3 },
            borderTop: { xs: `1px solid ${theme.palette.divider}`, md: 0 },
            borderLeft: { md: `1px solid ${theme.palette.divider}` },
          })}>
            <Stack spacing={2.25} divider={<Divider />}>
              <CardEditorSection title={t("photo")}>
                <CardPhotoField portrait={portrait} choosePhoto={choosePhoto} />
                {pendingPhoto && (
                  <Typography variant="caption" color="text.secondary" role="status">
                    {t(settings.published && settings.visible.includes("photo") ? "photo_pending_public" : "photo_pending")}
                  </Typography>
                )}
              </CardEditorSection>
              <CardEditorSection title={t("player_details")}>
                <TextField fullWidth required label={t("name")} value={settings.name}
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                  onChange={(event) => setSettings({ ...settings, name: event.target.value })} />
                <CardUsernameField value={settings.username} onChange={(username) =>
                  setSettings({ ...settings, username })} />
                <TextField select fullWidth label={t("area")} value={settings.area ?? ""}
                  slotProps={{ inputLabel: { shrink: true }, select: { displayEmpty: true } }}
                  onChange={(event) => setSettings({ ...settings, area: event.target.value || null })}>
                  <MenuItem value="">{t("no_preference")}</MenuItem>
                  {areas.map((area) => <MenuItem key={area} value={area}>{area}</MenuItem>)}
                </TextField>
                <TextField fullWidth label={t("position")} value={settings.position ?? ""}
                  slotProps={{ htmlInput: { maxLength: 60 } }}
                  onChange={(event) => setSettings({ ...settings, position: event.target.value || null })} />
              </CardEditorSection>
              {data.earned.includes("founder") && (
                <CardStyleOptions founder={settings.badges[0] === "founder"}
                  onChange={(founder) => setSettings({ ...settings, badges: founder ? ["founder"] : [] })} />
              )}
              <CardDisplayOptions settings={settings} onChange={setSettings} />
            </Stack>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} disabled={busy}>{t("cancel")}</Button>
        <Button type="submit" form="player-card-form" variant="contained" loading={busy}>
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
