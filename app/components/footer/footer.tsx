"use client";

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
              xs: "flex-start",
              sm: "center",
            },
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="caption">Programado por </Typography>
            <Link
              href="https://github.com/andrefernandes-95"
              rel="noopener noreferrer"
              target="_blank"
              component={NextLink}
            >
              <Typography
                variant="body1"
                sx={(theme) => ({
                  fontWeight: 900,
                  color: theme.palette.primary.main,
                })}
              >
                André Fernandes
              </Typography>
            </Link>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption">
              Onde Jogamos © {new Date().getFullYear()}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
