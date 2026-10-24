"use client";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function MatchShareButtons({ id }: { id: string }) {
  const tApp = useTranslations();
  const url = `https://ondejogamos.com/match/${id}`;
  return (
    <Stack sx={{ alignItems: "center", flexDirection: "row", gap: 1 }}>
      <Typography variant="caption">
        {tApp("App.MatchShareButtons.share_this_match")}
      </Typography>
      <WhatsappShareButton
        url={url}
        title={tApp("App.MatchShareButtons.lets_play")}
        separator=""
        aria-label={tApp("App.MatchShareButtons.share_on_whatsapp")}
      >
        <WhatsappIcon size={30} round />
      </WhatsappShareButton>
    </Stack>
  );
}
