"use client";

import LanguageSettings from "@/app/components/language-settings/language-settings";
import { AppRoutes } from "@/app/utils/routes";
import { Instagram, WhatsApp } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";

export default function Footer() {
  const tApp = useTranslations();

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        mt: 8,
        py: { xs: 3, md: 4 },
        background: theme.palette.grey[200],
        color: theme.palette.primary.main,
      })}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{
            justifyContent: "space-between",
            alignItems: {
              sm: "center",
            },
            textAlign: "center",
          }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <IconButton
              component="a"
              rel="noopener noreferrer"
              target="_blank"
              size="small"
              href="https://chat.whatsapp.com/GfmyVK1nYxe22XqrhTmpiT"
            >
              <WhatsApp />
            </IconButton>
            <IconButton
              component="a"
              rel="noopener noreferrer"
              target="_blank"
              size="small"
              href="http://instagram.com/ondejogamos"
            >
              <Instagram />
            </IconButton>
          </Stack>

          <Stack sx={{ alignItems: "center" }}>
            <Link href={AppRoutes.HOME} variant="body2">
              {tApp("App.Footer.home")}
            </Link>
            <Link href={AppRoutes.PLAYERS} variant="body2">
              {tApp("App.Footer.player_list")}
            </Link>
            <Link href={AppRoutes.PITCHES} variant="body2">
              {tApp("App.Footer.pitches_list")}
            </Link>
          </Stack>

          <Stack spacing={0.5} sx={{ alignItems: "center" }}>
            <LanguageSettings />
            <Typography variant="body2">
              Onde Jogamos © {new Date().getFullYear()}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
