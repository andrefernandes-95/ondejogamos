"use client";

import AuthNavbar from "@/app/components/auth-navbar/auth-navbar";
import { Logo } from "@/app/components/logo/logo";
import { brandBlueLight } from "@/app/design/brand-colors";
import { homeView } from "@/app/utils/home-schedule";
import { AppRoutes } from "@/app/utils/routes";
import { Box, Button, Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HomeNavigation() {
  const t = useTranslations("App.HomeSchedule");
  const agenda = useTranslations("App.Agenda");
  const search = useSearchParams();
  const activeView = homeView(search);
  const views = new URLSearchParams(search);
  for (const key of ["schedulePitch", "scheduleDay", "scheduleTime", "scheduleArea"]) {
    views.delete(key);
  }

  return (
    <Stack component="nav" aria-label={t("navigation")} direction="row" spacing={0.5}
      sx={{ gridArea: "views", p: 0.5, borderRadius: 2, bgcolor: brandBlueLight }}>
      {(["schedule", "games"] as const).map((view) => {
        views.set("view", view);
        return (
          <Button key={view} fullWidth component={Link} href={`/?${views}`} scroll={false}
            variant={activeView === view ? "contained" : "text"}
            aria-current={activeView === view ? "page" : undefined} sx={{ whiteSpace: "nowrap" }}>
            {view === "schedule" ? agenda("schedule") : t("browse")}
          </Button>
        );
      })}
    </Stack>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("App.Agenda");
  const isPitchesPage = pathname === AppRoutes.PITCHES;

  if (pathname === AppRoutes.HOME) {
    return (
      <Box component="header" sx={{ bgcolor: "background.paper", color: "primary.main", borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg" sx={{
          display: "grid", alignItems: "center", gap: 1, py: 1,
          gridTemplateAreas: { xs: '"brand account" "views views"', md: '"brand views account"' },
          gridTemplateColumns: { xs: "minmax(0, 1fr) auto", md: "minmax(0, 1fr) auto minmax(0, 1fr)" },
        }}>
          <Box sx={{ gridArea: "brand" }}><Logo compact onLight /></Box>
          <Suspense fallback={null}><HomeNavigation /></Suspense>
          <Box sx={{ gridArea: "account", justifySelf: "end" }}><AuthNavbar compact home /></Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="nav" sx={{ bgcolor: "primary.main", color: "common.white", py: 1 }}>
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Logo compact />
          <Stack direction="row" sx={{
            order: { xs: 3, md: 1 }, width: { xs: "100%", md: "auto" }, ml: { xs: 0, md: 1 }, gap: 1,
          }}>
            <Button href={AppRoutes.GAMES} color="inherit">{t("nav_matches")}</Button>
            <Button href={AppRoutes.PITCHES} color="inherit" aria-current={isPitchesPage ? "page" : undefined}
              sx={isPitchesPage ? { bgcolor: "rgba(255, 255, 255, 0.16)" } : undefined}>
              {t("nav_pitches")}
            </Button>
          </Stack>
          <Box sx={{ order: 2, ml: "auto" }}><AuthNavbar compact /></Box>
        </Stack>
      </Container>
    </Box>
  );
}
