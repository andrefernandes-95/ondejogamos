import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { BrandMark } from "./brand-mark";

export const Logo = () => {
  const t = useTranslations("App.Logo");
  return (
    <Stack component={Link} href="/" direction="row" spacing={0.5}
      sx={{ alignItems: "flex-start", color: "common.white", textDecoration: "none" }}>
      <Stack sx={{ pt: 0.5 }}><BrandMark size={24} /></Stack>
      <Stack>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>Onde Jogamos</Typography>
        <Typography variant="caption">{t("a_community_to_play_casual_football")}</Typography>
      </Stack>
    </Stack>
  );
};
