"use client";

import { AppRoutes } from "@/app/utils/routes";
import { Box, Container, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

export default function Footer() {
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
          <Stack spacing={0.5}>
            <Typography variant="body2">Programado por </Typography>
            <Link
              href="https://github.com/andrefernandes-95"
              rel="noopener noreferrer"
              target="_blank"
              component={NextLink}
            >
              <Typography
                variant="body2"
                sx={(theme) => ({
                  fontWeight: 900,
                  color: theme.palette.primary.main,
                })}
              >
                André Fernandes
              </Typography>
            </Link>
          </Stack>

          <Stack>
            <Link href={AppRoutes.HOME} variant="body2">
              Início
            </Link>
            <Link href={AppRoutes.PLAYERS} variant="body2">
              Lista de Jogadores
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
