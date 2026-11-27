"use client";

import AuthNavbar from "@/app/components/auth-navbar/auth-navbar";
import { Logo } from "@/app/components/logo/logo";
import ViewNavigation from "@/app/components/view-navigation/view-navigation";
import { homeView, scheduleDraftKeys } from "@/app/utils/home-schedule";
import { AppRoutes } from "@/app/utils/routes";
import { CalendarMonthRounded, EventAvailableRounded } from "@mui/icons-material";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MainNavigation({ pathname }: { pathname: string }) {
  const t = useTranslations("App.HomeSchedule");
  const agenda = useTranslations("App.Agenda");
  const search = useSearchParams();
  const isHome = pathname === AppRoutes.HOME;
  const activeView = isHome ? homeView(search) : undefined;
  const views = new URLSearchParams(isHome ? search : undefined);
  for (const key of scheduleDraftKeys) {
    views.delete(key);
  }
  const links = (["schedule", "games"] as const).map((view) => {
    const params = new URLSearchParams(views);
    params.set("view", view);
    return {
      href: `/?${params}`, label: view === "schedule" ? agenda("schedule") : t("browse"),
      icon: view === "schedule" ? <EventAvailableRounded /> : <CalendarMonthRounded />,
      active: activeView === view,
    };
  });
  return <ViewNavigation label={t("navigation")} links={links} />;
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Box component="header" sx={{ bgcolor: "background.paper", color: "primary.main", borderBottom: 1, borderColor: "divider" }}>
      <Container maxWidth="lg" sx={{
        display: "grid", alignItems: "center", gap: 1, py: 1, px: { xs: 1.25, sm: 3 },
        gridTemplateAreas: { xs: '"brand account" "views views"', md: '"brand views account"' },
        gridTemplateColumns: { xs: "minmax(0, 1fr) auto", md: "minmax(0, 1fr) auto auto" },
        columnGap: { md: 4 },
      }}>
        <Box sx={{ gridArea: "brand" }}><Logo compact onLight /></Box>
        <Box sx={{
          gridArea: "views", justifySelf: { md: "end" },
          "& > nav": { display: { xs: "grid", md: "flex" }, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
          "& > nav > a": { mx: 0, px: { xs: 0.75, sm: 1.5 }, fontSize: { xs: "0.825rem", sm: "0.95rem" } },
        }}>
          <Suspense fallback={null}><MainNavigation pathname={pathname} /></Suspense>
        </Box>
        <Box sx={{ gridArea: "account", justifySelf: "end", pl: { md: 2 }, borderLeft: { md: 1 }, borderColor: { md: "divider" } }}>
          <AuthNavbar />
        </Box>
      </Container>
    </Box>
  );
}
