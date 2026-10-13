"use client";

import { useTranslations } from "next-intl";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import { Stack } from "@mui/material";

export default function MatchShareButtons({ id }: { id: string }) {
  const t = useTranslations();
  const url = `https://ondejogamos.com/match/${id}`;
  return (
    <Stack>
      <WhatsappShareButton
        url={url}
        title={t("Share.invitation")}
        separator=""
        aria-label={t("Share.whatsapp")}
      >
        <WhatsappIcon size={30} round />
      </WhatsappShareButton>
    </Stack>
  );
}
