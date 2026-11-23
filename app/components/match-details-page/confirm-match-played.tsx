import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { Alert, Button, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ConfirmMatchPlayed({
  matchId,
  confirmed,
  canConfirm,
}: {
  matchId: string;
  confirmed: boolean;
  canConfirm: boolean;
}) {
  const t = useTranslations("App.MatchDetailsPage");
  const tErrors = useTranslations("ApiErrors");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setSaving(true);
    setError("");
    try {
      const body = new FormData();
      body.set("id", matchId);
      const response = await fetch("/api/matches", { method: "PATCH", body });
      if (response.ok) {
        setSaved(true);
      } else {
        setError(tErrors(await readApiErrorCodeFromResponse(response)));
      }
    } catch {
      setError(tErrors("MATCH_CONFIRMATION_FAILED"));
    } finally {
      setSaving(false);
    }
  }

  if (confirmed || saved) {
    return <Alert severity="success">{t("played_confirmed")}</Alert>;
  }
  if (!canConfirm) {
    return null;
  }

  return (
    <Stack spacing={1}>
      {error && <Alert severity="error">{error}</Alert>}
      <Button variant="outlined" onClick={confirm} loading={saving}>
        {t("confirm_played")}
      </Button>
    </Stack>
  );
}
