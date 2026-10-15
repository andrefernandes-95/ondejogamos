"use client";

import LanguageSettings from "@/app/components/language-settings/language-settings";
import useLocalization from "@/app/hooks/locale";
import { AppRoutes } from "@/app/utils/routes";
import { Instagram, WhatsApp } from "@mui/icons-material";
import {
  Box,
  Container,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";

export default function Footer() {
  const isEn = useLocalization() === "EN";

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
              {isEn ? "Home" : "Início"}
            </Link>
            <Link href={AppRoutes.PLAYERS} variant="body2">
              {isEn ? "Player List" : "Lista de Jogadores"}
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
