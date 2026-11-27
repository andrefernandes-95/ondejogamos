"use client";

import AreaSelector from "@/app/components/area-selector/area-selector";
import MatchList from "@/app/components/match-list/match-list";
import PageContainer from "@/app/components/page-container/page-container";
import PageTitle from "@/app/components/page-title/page-title";
import { homeView, updateHomeSearch } from "@/app/utils/home-schedule";
import ScheduleView from "./schedule-view";
import type { LocationWithGameCount } from "@/app/services/locations";
import { Box, Stack } from "@mui/material";
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
  const requestedArea = search.get("area") ?? initialArea;
  const area = data.some((entry) => entry.area === requestedArea) ? requestedArea : "";
  const requestedMunicipality = search.get("municipality") ?? "";
  const municipality = data.some((entry) =>
    entry.area === area && entry.municipality === requestedMunicipality) ? requestedMunicipality : "";

  function changeArea(value: string) {
    updateHomeSearch({ view: "games", area: value, municipality: null, date: null });
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `preferredArea=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  }

  if (homeView(search) === "schedule") {
    return (
      <PageContainer>
        <ScheduleView data={data} initialArea={initialArea} today={today} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Stack spacing={{ xs: 2.5, md: 3 }}>
        <Box sx={{
          display: "grid",
          gridTemplateAreas: {
            xs: '"heading" "filters"', md: '"heading filters"',
          },
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "auto minmax(0, 1fr)" },
          alignItems: "center", gap: { xs: 1.25, md: 2.5 },
        }}>
          <Box sx={{ gridArea: "heading" }}><PageTitle title={t("title")} compact /></Box>
          <AreaSelector data={data} area={area} municipality={municipality}
            districtOpen={districtOpen} setDistrictOpen={setDistrictOpen}
            onAreaChange={changeArea}
            onMunicipalityChange={(value) =>
              updateHomeSearch({ area, municipality: value || null, date: null })} />
        </Box>
        <MatchList area={area} municipality={municipality} today={today}
          requestedDay={search.get("date")}
          onDayChange={(day) => updateHomeSearch({ area, date: day })}
          onClearLocation={() => changeArea("")} />
      </Stack>
    </PageContainer>
  );
}
