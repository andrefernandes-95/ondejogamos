import { SportsSoccerOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function MatchPitchPhoto({
  src, details = false, compact = false,
}: {
  src?: string | null;
  details?: boolean;
  compact?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = src && src !== failedSrc;

  return (
    <Box sx={{
      position: "relative", width: details ? { xs: "100%", md: "50%" } : "100%",
      aspectRatio: compact ? "1.5 / 1" : "2.5 / 1",
      borderRadius: compact ? 2 : 6, overflow: "hidden", flexShrink: 0,
      display: "grid", placeItems: "center", bgcolor: "action.hover",
    }}>
      {showImage ? (
        <Image src={src} alt="" fill
          sizes={compact ? "(max-width: 899px) 30vw, 160px" : "(max-width: 600px) 100vw 50vw"}
          onError={() => setFailedSrc(src)} style={{ objectFit: "cover" }} />
      ) : (
        <SportsSoccerOutlined color="action" aria-hidden="true" />
      )}
      {!compact && showImage && <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent 25%)",
      }} />}
    </Box>
  );
}
