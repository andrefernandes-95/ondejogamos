"use client";

import CreatePitchButton from "@/app/components/create-pitch-button/create-pitch-button";
import MatchList from "@/app/components/match-list/match-list";
import MatchScheduleSuggestion from "@/app/components/match-schedule-suggestion/match-schedule-suggestion";
import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import type { LocationWithGameCount } from "@/app/services/locations";
import { AppRoutes } from "@/app/utils/routes";
import { ExpandMore, PlaceOutlined } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import HomeFilters from "./home-filters";

function savePreferredArea(area: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `preferredArea=${encodeURIComponent(area)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

export default function HomeClient({ data, initialArea }: {
  data: LocationWithGameCount[];
  initialArea: string;
}) {
  const t = useTranslations("App.HomeClient");
  const tPitch = useTranslations("App.CreatePitchButton");
  const [area, setArea] = useState(initialArea);
  const [municipality, setMunicipality] = useState("");
  const [isCreatingPitch, setIsCreatingPitch] = useState(false);
  const [showPitches, setShowPitches] = useState(false);
  const areas = [...new Set(data.map((entry) => entry.area))];

  function chooseArea(nextArea: string) {
    if (nextArea === area) return;
    setArea(nextArea);
    setMunicipality("");
    savePreferredArea(nextArea);
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Box component="section" aria-labelledby="home-heading" sx={{
          backgroundImage: "linear-gradient(125deg, #EFF5FF 12%, #F8FAFF 55%, #F2F7FF 100%)",
          border: "1px solid #D8E6FF", borderRadius: "16px", px: { xs: 2, sm: 4 }, py: { xs: 3, md: 4 },
        }}>
          <Stack spacing={2.5} sx={{ maxWidth: 760 }}>
            <Stack spacing={0.5}>
              <Typography component="h1" id="home-heading" color="primary.dark"
                sx={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.035em" }}>
                {t("title")}
              </Typography>
              <Typography color="text.secondary">{t("intro")}</Typography>
            </Stack>
            <HomeFilters data={data} area={area} municipality={municipality}
              onAreaChange={chooseArea} onMunicipalityChange={setMunicipality} />
          </Stack>
        </Box>
        <Stack component="section" aria-labelledby="home-upcoming" spacing={1.5}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
            <Typography component="h2" id="home-upcoming" variant="h5">{t("upcoming")}</Typography>
            <ScheduleMatchButton selectedArea={area} onAddPitch={() => setIsCreatingPitch(true)}
              areaChoices={areas} onAreaChosen={chooseArea} prominent />
          </Stack>
          <MatchList key={area} area={area} municipality={municipality} />
        </Stack>
        <Accordion variant="outlined" disableGutters expanded={showPitches} onChange={(_, open) => setShowPitches(open)}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="home-pitches" id="home-pitches-trigger">
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <PlaceOutlined color="primary" />
              <Typography sx={{ fontWeight: 600 }}>{t("explore_pitches")}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {showPitches && (
              <Stack spacing={1.5} sx={{ alignItems: "start" }}>
                <MatchScheduleSuggestion key={area} area={area} onAddPitch={(pitchArea) => {
                  chooseArea(pitchArea);
                  setIsCreatingPitch(true);
                }} />
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  <Button href={AppRoutes.PITCHES}>{t("see_all_pitches")}</Button>
                  {area && <Button startIcon={<PlaceOutlined />} onClick={() => setIsCreatingPitch(true)}>
                    {tPitch("add_pitch")}
                  </Button>}
                </Stack>
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>
        {isCreatingPitch && (
          <CreatePitchButton selectedArea={area} isCreatingPitch={isCreatingPitch}
            setIsCreatingPitch={setIsCreatingPitch} hideTrigger />
        )}
      </Stack>
    </Container>
  );
}
