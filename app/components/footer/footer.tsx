"use client";

import { useTranslations } from "next-intl";

import { AppRoutes } from "@/app/utils/routes";
import { Instagram, WhatsApp } from "@mui/icons-material";
import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";

export default function Footer() {
  const t = useTranslations();
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
              aria-label={t("Footer.whatsapp")}
            >
              <WhatsApp />
            </IconButton>
            <IconButton
              component="a"
              rel="noopener noreferrer"
              target="_blank"
              size="small"
              href="http://instagram.com/ondejogamos"
              aria-label={t("Footer.instagram")}
            >
              <Instagram />
            </IconButton>
          </Stack>

          <Stack>
            <Link href={AppRoutes.HOME} variant="body2">
              {t("Common.home")}
            </Link>
            <Link href={AppRoutes.PLAYERS} variant="body2">
              {t("Footer.players")}
            </Link>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="body2">
              Onde Jogamos © {new Date().getFullYear()}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
