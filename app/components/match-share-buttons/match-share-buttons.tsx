"use client";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import { Stack } from "@mui/material";

export default function MatchShareButtons({ id }: { id: string }) {
  const url = `https://ondejogamos.com/match/${id}`;
  return (
    <Stack>
      <WhatsappShareButton
        url={url}
        title="Bora jogar? Espreita este jogo: "
        separator=""
        aria-label="Partilhar no WhatsApp"
      >
        <WhatsappIcon size={30} round />
      </WhatsappShareButton>
    </Stack>
  );
}
