"use client";

import LanguageSettings from "@/app/components/language-settings/language-settings";
import { Logo } from "@/app/components/logo/logo";
import { AppRoutes } from "@/app/utils/routes";
import { Instagram, WhatsApp } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { Box, Container, IconButton, Link, Stack, Typography } from "@mui/material";

const links = [
  { href: AppRoutes.HOME, label: "home" },
  { href: AppRoutes.PLAYERS, label: "player_list" },
  { href: AppRoutes.PITCHES, label: "pitches_list" },
] as const;

const socials = [
  { href: "https://chat.whatsapp.com/GfmyVK1nYxe22XqrhTmpiT", label: "WhatsApp", Icon: WhatsApp },
  { href: "https://instagram.com/ondejogamos", label: "Instagram", Icon: Instagram },
];

export default function Footer() {
  const t = useTranslations("App.Footer");

  return (
    <Box component="footer" sx={{ mt: { xs: 3, md: 5 }, bgcolor: "#102143", color: "common.white" }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        <Box sx={{
          display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr) auto", sm: "1.5fr 1fr auto" },
          alignItems: "start", gap: { xs: 2.5, sm: 4 }, py: { xs: 3, sm: 4 },
        }}>
          <Stack spacing={1.25} sx={{ gridColumn: { xs: "1 / -1", sm: "auto" }, alignItems: "flex-start" }}>
            <Logo compact />
            <Stack direction="row" spacing={0.75}>
              {socials.map(({ href, label, Icon }) => (
                <IconButton key={label} component="a" href={href} aria-label={label} color="inherit"
                  target="_blank" rel="noopener noreferrer" sx={{
                    minWidth: 44, minHeight: 44, borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.09)", "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
                  }}><Icon fontSize="small" /></IconButton>
              ))}
            </Stack>
          </Stack>
          <Stack component="nav" aria-label={t("explore")} sx={{ alignItems: "flex-start" }}>
            <Typography component="p" variant="body2" sx={{ mb: 0.25, fontWeight: 800 }}>{t("explore")}</Typography>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} variant="body2" underline="hover"
                sx={{ color: "#D7E5FC", display: "inline-flex", alignItems: "center", minHeight: 30 }}>
                {t(label)}
              </Link>
            ))}
          </Stack>
          <Stack spacing={0.75} sx={{ alignItems: "flex-start", justifySelf: "end" }}>
            <Typography component="p" variant="body2" sx={{ fontWeight: 800 }}>{t("language")}</Typography>
            <LanguageSettings />
          </Stack>
        </Box>
        <Typography variant="body2" component="p" sx={{ borderTop: "1px solid #ffffff2b", color: "#D7E5FC", py: 1.5 }}>
          © {new Date().getFullYear()} Onde Jogamos
        </Typography>
      </Container>
    </Box>
  );
}
