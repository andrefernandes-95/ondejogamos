"use client";

import { brandBlueLight } from "@/app/design/brand-colors";
import { matchWhatsAppText, type ShareableMatch } from "@/app/utils/match-share";
import { AppRoutes } from "@/app/utils/routes";
import { ContentCopyRounded, IosShareRounded, WhatsApp } from "@mui/icons-material";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { WhatsappShareButton } from "react-share";

export default function MatchShareButtons({ match }: { match: ShareableMatch }) {
  const t = useTranslations("App.MatchShareButtons");
  const locale = useLocale();
  const titleId = useId();
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const path = AppRoutes.MATCH_DETAILS(String(match.id));
  const url = `https://ondejogamos.com${path}`;
  const [copyUrl, setCopyUrl] = useState(url);

  async function copyLink() {
    const link = new URL(path, window.location.origin).href;
    setCopyUrl(link);
    try {
      await navigator.clipboard.writeText(link);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <Stack component="section" aria-labelledby={titleId} spacing={1.25} sx={{ bgcolor: brandBlueLight, p: { xs: 1.25, sm: 1.75 }, borderRadius: 3 }}>
      <Stack direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
        <IosShareRounded fontSize="small" color="primary" />
        <Typography component="h2" id={titleId} sx={{ fontWeight: 800 }}>{t("share_this_match")}</Typography>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
        <Button component={WhatsappShareButton} variant="contained" color="success" startIcon={<WhatsApp />}
          url={url} title={matchWhatsAppText(match, locale)} separator={"\n"} resetButtonStyle={false}>
          {t("share_on_whatsapp")}
        </Button>
        <Button type="button" variant="outlined" startIcon={<ContentCopyRounded />} onClick={() => void copyLink()}>
          {t("copy_link")}
        </Button>
      </Stack>
      {status === "copied" && <Typography variant="caption" role="status">{t("copied")}</Typography>}
      {status === "failed" && <TextField label={t("link_label")} value={copyUrl}
        helperText={<span role="status">{t("copy_failed")}</span>}
        onFocus={(event) => event.target.select()} slotProps={{ input: { readOnly: true } }} />}
    </Stack>
  );
}
