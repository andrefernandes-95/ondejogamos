"use client";

import AuthNavbar from "@/app/components/auth-navbar/auth-navbar";
import { Logo } from "@/app/components/logo/logo";
import { AppRoutes } from "@/app/utils/routes";
import { Box, Button, Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("App.Agenda");
  const isMatchesPage = pathname === AppRoutes.HOME;
  const isPitchesPage = pathname === AppRoutes.PITCHES;
  const activeStyle = { bgcolor: "rgba(255, 255, 255, 0.16)" };

  return (
    <Box
      component="nav"
      sx={(theme) => ({
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
        py: 1,
      })}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}
        >
          <Logo compact />
          <Stack
            direction="row"
            sx={{
              order: { xs: 3, md: 1 },
              width: { xs: "100%", md: "auto" },
              ml: { xs: 0, md: 1 },
              gap: 1,
            }}
          >
            <Button
              href={AppRoutes.HOME}
              color="inherit"
              aria-current={isMatchesPage ? "page" : undefined}
              sx={isMatchesPage ? activeStyle : undefined}
            >
              {t("nav_matches")}
            </Button>
            <Button
              href={AppRoutes.PITCHES}
              color="inherit"
              aria-current={isPitchesPage ? "page" : undefined}
              sx={isPitchesPage ? activeStyle : undefined}
            >
              {t("nav_pitches")}
            </Button>
          </Stack>
          <Box sx={{ order: { xs: 2, md: 2 }, ml: "auto" }}>
            <AuthNavbar compact />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
