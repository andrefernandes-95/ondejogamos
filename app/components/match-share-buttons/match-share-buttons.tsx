"use client";

import type { ShareableMatch } from "@/app/utils/match-share";
import { matchWhatsAppText } from "@/app/utils/match-share";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

export default function MatchShareButtons({ match }: { match: ShareableMatch }) {
  const tApp = useTranslations();
  const locale = useLocale();
  const url = `https://ondejogamos.com/match/${match.id}`;

  return (
    <Stack sx={{ alignItems: "center", flexDirection: "row", gap: 1 }}>
      <Typography variant="caption">
        {tApp("App.MatchShareButtons.share_this_match")}
      </Typography>
      <WhatsappShareButton
        url={url}
        title={matchWhatsAppText(match, locale)}
        separator="\n"
        aria-label={tApp("App.MatchShareButtons.share_on_whatsapp")}
      >
        <WhatsappIcon size={30} round />
      </WhatsappShareButton>
    </Stack>
  );
}
