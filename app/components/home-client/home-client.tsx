"use client";

import AreaSelector from "@/app/components/area-selector/area-selector";
import { LocationWithGameCount } from "@/app/services/locations";
import { Card, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Background } from "@/app/components/background/background";
import MatchList from "@/app/components/match-list/match-list";
import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import useLocalization from "@/app/hooks/locale";
import MatchScheduleSuggestion from "@/app/components/match-schedule-suggestion/match-schedule-suggestion";
import CreatePitchButton from "@/app/components/create-pitch-button/create-pitch-button";

interface Props {
  data: LocationWithGameCount[];
  initialArea: string;
}

export default function HomeClient({ data, initialArea }: Props) {
  const [selectedArea, setSelectedArea] = useState<string>(initialArea);
  const [isCreatingPitch, setIsCreatingPitch] = useState<boolean>(false);

  const isEn = useLocalization() === "EN";

  const handleSelectedArea = (selected: string) => {
    setSelectedArea(selected);

    const secure = window.location.protocol === "https" ? "; Secure" : "";
    document.cookie =
      `preferredArea=${encodeURIComponent(selected)}` +
      `; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  };

  const headerText = () =>
    isEn ? (
      <>
        Want to play casual football? In <strong>Onde Jogamos</strong> you can
        find matches, join other players and organize games in your area.
      </>
    ) : (
      <>
        Falta-te uma futebolada? No <strong>Onde Jogamos</strong> podes
        encontrar jogos, juntar-te a outros jogadores e organizar partidas na
        tua zona.
      </>
    );

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
            {headerText()}
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
            />

            <CreatePitchButton
              isCreatingPitch={isCreatingPitch}
              setIsCreatingPitch={setIsCreatingPitch}
              selectedArea={selectedArea}
            />
          </Stack>
        </Card>
        <MatchScheduleSuggestion area={selectedArea} />
        <MatchList
          area={selectedArea}
          onAddPitch={() => setIsCreatingPitch(true)}
        />
      </Stack>
    </Container>
  );
}
