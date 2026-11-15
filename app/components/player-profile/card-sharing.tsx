"use client";

import { IosShareOutlined } from "@mui/icons-material";
import { Button, Snackbar } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

const imageUrl = "/api/player-card/image";

async function loadImage() {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("Card image could not be loaded");
  return new File([await response.blob()], "onde-jogamos.png", { type: "image/png" });
}

function downloadImage(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function CardSharing() {
  const t = useTranslations("App.PlayerCard");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [prepared, setPrepared] = useState<File | null>(null);

  async function shareImage() {
    setBusy(true);
    setStatus("");
    try {
      const file = prepared ?? await loadImage();
      if (!navigator.canShare?.({ files: [file] })) {
        downloadImage(file);
        return;
      }
      if (!prepared && navigator.userActivation?.isActive === false) {
        setPrepared(file);
        setStatus(t("share_ready_note"));
        return;
      }
      try {
        await navigator.share({ files: [file] });
      } catch (error) {
        if (!(error instanceof Error && error.name === "AbortError")) downloadImage(file);
      }
    } catch {
      setStatus(t("share_failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="contained" startIcon={<IosShareOutlined />} onClick={shareImage} loading={busy}>
        {t(prepared ? "share_ready" : "share_image")}
      </Button>
      <Snackbar open={Boolean(status)} message={status} autoHideDuration={5000} onClose={() => setStatus("")} />
    </>
  );
}
