"use client";

import AreaSelector from "@/app/components/area-selector/area-selector";
import { LocationWithGameCount } from "@/app/services/locations";
import { Card, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Background } from "@/app/components/background/background";
import MatchList from "@/app/components/match-list/match-list";
import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import MatchScheduleSuggestion from "@/app/components/match-schedule-suggestion/match-schedule-suggestion";
import CreatePitchButton from "@/app/components/create-pitch-button/create-pitch-button";
import { useListMatchesForArea } from "@/app/hooks/matches";
import { useTranslations } from "next-intl";

interface Props {
  data: LocationWithGameCount[];
  initialArea: string;
}

export default function HomeClient({ data, initialArea }: Props) {
  const tApp = useTranslations();
  const [selectedArea, setSelectedArea] = useState<string>(initialArea);
  const [isCreatingPitch, setIsCreatingPitch] = useState<boolean>(false);
  const { matches, refresh, error, loading, hasFetched } =
    useListMatchesForArea(selectedArea);

  const handleSelectedArea = (selected: string) => {
    setSelectedArea(selected);

    const secure = window.location.protocol === "https" ? "; Secure" : "";
    document.cookie =
      `preferredArea=${encodeURIComponent(selected)}` +
      `; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Background />
      <Stack sx={{ gap: 2 }}>
        <Card variant="outlined">
          <Typography
            variant="body1"
            sx={(theme) => ({
              borderLeft: `2px solid ${theme.palette.primary.main}`,
              paddingLeft: 2,
            })}
          >
            {tApp.rich("App.HomeClient.description", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </Typography>
        </Card>
        <Card sx={{ p: 4 }} variant="outlined">
          <Stack
            sx={{
              gap: 2,
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <AreaSelector
              selectedArea={selectedArea}
              handleSelectedArea={handleSelectedArea}
              data={data}
            />

            <ScheduleMatchButton
              selectedArea={selectedArea}
              onAddPitch={() => setIsCreatingPitch(true)}
              onMatchSaved={refresh}
            />

            <CreatePitchButton
              isCreatingPitch={isCreatingPitch}
              setIsCreatingPitch={setIsCreatingPitch}
              selectedArea={selectedArea}
            />
          </Stack>
        </Card>
        <MatchScheduleSuggestion
          area={selectedArea}
          onMatchSaved={refresh}
        />
        <MatchList
          area={selectedArea}
          onAddPitch={() => setIsCreatingPitch(true)}
          matches={matches}
          refresh={refresh}
          error={error}
          loading={loading}
          hasFetched={hasFetched}
        />
      </Stack>
    </Container>
  );
}
