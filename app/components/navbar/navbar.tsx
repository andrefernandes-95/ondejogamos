"use client";

import AuthNavbar from "@/app/components/auth-navbar/auth-navbar";
import { Logo } from "@/app/components/logo/logo";
import { AppRoutes } from "@/app/utils/routes";
import { Box, Button, Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const agenda = usePathname() === AppRoutes.HOME;
  const t = useTranslations("App.Agenda");

  return (
    <>
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
            sx={{
              flexDirection: {
                xs: agenda ? "row" : "column",
                sm: "row",
              },
              alignItems: {
                xs: "center",
              },
              pt: {
                xs: agenda ? 0 : 2,
                sm: 0,
              },
              justifyContent: {
                xs: agenda ? "space-between" : "center",
                sm: "space-between",
              },
              gap: 1,
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: { md: 2 } }}>
              <Logo compact={agenda} />
              {agenda && (
                <Stack direction="row" sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                  <Button href={AppRoutes.HOME} color="inherit" aria-current="page"
                    sx={{ bgcolor: "rgba(255, 255, 255, 0.16)" }}>
                    {t("nav_matches")}
                  </Button>
                  <Button href={AppRoutes.PITCHES} color="inherit">{t("nav_pitches")}</Button>
                </Stack>
              )}
            </Stack>
            <AuthNavbar compact={agenda} />
          </Stack>
        </Container>
      </Box>
    </>
  );
}
