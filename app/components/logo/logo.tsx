import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { BrandMark } from "./brand-mark";

export const Logo = ({ compact = false, onLight = false }: { compact?: boolean; onLight?: boolean }) => {
  const t = useTranslations("App.Logo");
  return (
    <Stack component={Link} href="/" direction="row" spacing={0.5}
      sx={{ alignItems: compact ? "center" : "flex-start", color: onLight ? "primary.main" : "common.white", textDecoration: "none" }}>
      <Stack sx={{
        pt: compact ? 0 : 0.5,
        ...(compact && { "& svg": { width: { xs: 14, sm: 18 }, height: { xs: 14, sm: 18 } } }),
      }}><BrandMark size={compact ? 18 : 24} color="currentColor" /></Stack>
      <Stack>
        <Typography component="span" variant="h5" sx={{
          fontWeight: 900, whiteSpace: "nowrap", fontSize: compact ? { xs: "0.92rem", sm: "1.5rem" } : undefined,
        }}>Onde Jogamos</Typography>
        {!compact && <Typography variant="caption">{t("a_community_to_play_casual_football")}</Typography>}
      </Stack>
    </Stack>
  );
};
