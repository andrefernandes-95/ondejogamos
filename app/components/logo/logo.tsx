import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { BrandMark } from "./brand-mark";

export const Logo = ({ compact = false }: { compact?: boolean }) => {
  const t = useTranslations("App.Logo");
  return (
    <Stack component={Link} href="/" direction="row" spacing={0.5}
      sx={{ alignItems: compact ? "center" : "flex-start", color: "common.white", textDecoration: "none" }}>
      <Stack sx={{ pt: compact ? 0 : 0.5 }}><BrandMark size={compact ? 18 : 24} /></Stack>
      <Stack>
        <Typography variant="h5" sx={{
          fontWeight: 900, fontSize: compact ? { xs: "1rem", sm: "1.5rem" } : undefined,
        }}>Onde Jogamos</Typography>
        {!compact && <Typography variant="caption">{t("a_community_to_play_casual_football")}</Typography>}
      </Stack>
    </Stack>
  );
};
