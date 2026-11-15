"use client";

import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { Alert, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

interface Props {
  name: string;
  areas: string[];
  preferredArea: string;
  preferredPosition: string;
}

export default function ProfileForm({ name, areas, preferredArea, preferredPosition }: Props) {
  const t = useTranslations("App.ProfileForm");
  const tErrors = useTranslations("ApiErrors");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const options = preferredArea && !areas.includes(preferredArea)
    ? [preferredArea, ...areas]
    : areas;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferred_area: fields.get("area") || null,
          preferred_position: String(fields.get("position") ?? "").trim() || null,
        }),
      });

      if (response.ok) setSaved(true);
      else setError(tErrors(await readApiErrorCodeFromResponse(response)));
    } catch {
      setError(tErrors("PROFILE_UPDATE_FAILED"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack component="form" spacing={2} onSubmit={submit} onChange={() => setSaved(false)}>
      <Typography component="h1" variant="h5">{t("title")}</Typography>
      <Typography>{name}</Typography>
      <TextField
        select
        label={t("area")}
        name="area"
        defaultValue={preferredArea}
        disabled={saving}
        slotProps={{ inputLabel: { shrink: true } }}
      >
        <MenuItem value="">{t("no_preference")}</MenuItem>
        {options.map((area) => <MenuItem key={area} value={area}>{area}</MenuItem>)}
      </TextField>
      <TextField
        label={t("position")}
        name="position"
        defaultValue={preferredPosition}
        placeholder={t("position_example")}
        slotProps={{ htmlInput: { maxLength: 60 } }}
        disabled={saving}
      />
      <Button type="submit" variant="contained" loading={saving}>{t("save")}</Button>
      {saved && <Alert severity="success" role="status">{t("saved")}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
