"use client";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { Stack, Typography } from "@mui/material";
import useLocalization from "@/app/hooks/locale";

export default function MatchShareButtons({ id }: { id: string }) {
  const url = `https://ondejogamos.com/match/${id}`;
  const isEn = useLocalization() === "EN";
  return (
    <Stack sx={{ alignItems: "center", flexDirection: "row", gap: 1 }}>
      <Typography variant="caption">
        {isEn ? "Share this match:" : "Partilhar jogo:"}
      </Typography>
      <WhatsappShareButton
        url={url}
        title={isEn ? "Lets play!" : "Bora jogar? Espreita este jogo: "}
        separator=""
        aria-label={isEn ? "Share on Whatsapp" : "Partilhar no WhatsApp"}
      >
        <WhatsappIcon size={30} round />
      </WhatsappShareButton>
    </Stack>
  );
}
