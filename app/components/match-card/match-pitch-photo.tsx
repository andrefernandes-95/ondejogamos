import { Box } from "@mui/material";
import Image from "next/image";

export default function MatchPitchPhoto({ src, details = false }: { src: string; details?: boolean }) {
  return (
    <Box sx={{
      position: "relative", width: details ? { xs: "100%", md: "50%" } : "100%",
      aspectRatio: "2.5 / 1", borderRadius: 6, overflow: "hidden", flexShrink: 0,
    }}>
      <Image src={src} alt="" fill sizes="(max-width: 600px) 100vw 50vw"
        style={{ objectFit: "cover" }} />
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent 25%)",
      }} />
    </Box>
  );
}
