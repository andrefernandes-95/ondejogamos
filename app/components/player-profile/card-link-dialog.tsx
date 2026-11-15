"use client";

import { playerCardPath } from "@/app/utils/player-card";
import { ContentCopy, Link as LinkIcon } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function CardLinkDialog({ publicId }: { publicId: string }) {
  const t = useTranslations("App.PlayerCard");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus(t("copied"));
    } catch {
      setStatus(t("copy_failed"));
    }
  }

  return (
    <>
      <Button startIcon={<LinkIcon />} onClick={() => {
        setStatus("");
        setUrl(new URL(playerCardPath(publicId), location.origin).href);
      }}>
        {t("get_link")}
      </Button>
      <Dialog open={Boolean(url)} onClose={() => setUrl("")} fullWidth maxWidth="xs"
        aria-labelledby="card-link-title">
        <DialogTitle id="card-link-title">{t("get_link")}</DialogTitle>
        <DialogContent sx={{ pt: "8px !important" }}>
          <TextField fullWidth autoFocus label={t("link_label")} value={url}
            onFocus={(event) => event.target.select()}
            helperText={<span role="status">{status}</span>}
            slotProps={{ input: { readOnly: true } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUrl("")}>{t("close")}</Button>
          <Button variant="contained" startIcon={<ContentCopy />} onClick={copy}>{t("copy_link")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
