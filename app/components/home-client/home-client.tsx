"use client";

import AreaSelector from "@/app/components/area-selector/area-selector";
import CreatePitchButton from "@/app/components/create-pitch-button/create-pitch-button";
import MatchList from "@/app/components/match-list/match-list";
import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import type { LocationWithGameCount } from "@/app/services/locations";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  data: LocationWithGameCount[];
  initialArea: string;
  today: string;
}

export default function HomeClient({ data, initialArea, today }: Props) {
  const t = useTranslations("App.Agenda");
  const search = useSearchParams();
  const [districtOpen, setDistrictOpen] = useState(false);
  const [isCreatingPitch, setIsCreatingPitch] = useState(false);
  const requestedArea = search.get("area") ?? initialArea;
  const area = data.some((entry) => entry.area === requestedArea) ? requestedArea : "";
  const requestedMunicipality = search.get("municipality") ?? "";
  const municipality = data.some((entry) =>
    entry.area === area && entry.municipality === requestedMunicipality) ? requestedMunicipality : "";

  function updateSearch(changes: Record<string, string | null>) {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    if (url.href !== window.location.href) window.history.pushState(null, "", url);
  }

  function changeArea(value: string) {
    updateSearch({ area: value, municipality: null, date: null });
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `preferredArea=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  }

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2.5, md: 4 } }}>
      <Stack spacing={{ xs: 2.5, md: 3 }}>
        <Box sx={{
          display: "grid",
          gridTemplateAreas: {
            xs: '"heading schedule" "filters filters"', md: '"heading filters schedule"',
          },
          gridTemplateColumns: { xs: "minmax(0, 1fr) auto", md: "auto minmax(0, 1fr) auto" },
          alignItems: "center", gap: { xs: 1.25, md: 2.5 },
        }}>
          <Typography component="h1" sx={{
            gridArea: "heading", fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.5rem" },
            lineHeight: 1.12, fontWeight: 800, letterSpacing: "-0.025em",
          }}>
            {t("title")}
          </Typography>
          <Box sx={{ gridArea: "schedule", justifySelf: "end" }}>
            <ScheduleMatchButton selectedArea={area} onChooseArea={() => setDistrictOpen(true)}
              onAddPitch={() => setIsCreatingPitch(true)} />
          </Box>
          <AreaSelector data={data} area={area} municipality={municipality}
            districtOpen={districtOpen} setDistrictOpen={setDistrictOpen}
            onAreaChange={changeArea}
            onMunicipalityChange={(value) =>
              updateSearch({ area, municipality: value || null, date: null })} />
        </Box>
        <MatchList area={area} municipality={municipality} today={today}
          requestedDay={search.get("date")}
          onDayChange={(day) => updateSearch({ area, date: day })}
          onClearLocation={() => changeArea("")} />
      </Stack>
      <CreatePitchButton selectedArea={area} isCreatingPitch={isCreatingPitch}
        setIsCreatingPitch={setIsCreatingPitch} showTrigger={false} />
    </Container>
  );
}
