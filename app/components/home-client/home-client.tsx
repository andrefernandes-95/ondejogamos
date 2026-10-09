"use client";

import AreaSelector from "@/app/components/area-selector/area-selector";
import CreatePitchModal from "@/app/components/modals/create-pitch-modal/create-pitch-modal";
import { Location } from "@/app/services/locations";
import { Button, Card, Container, Stack } from "@mui/material";
import { useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";
import { Background } from "@/app/components/background/background";
import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import MatchList from "@/app/components/match-list/match-list";
import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";

interface Props {
  data: Location[];
  initialArea: string;
}

export default function HomeClient({ data, initialArea }: Props) {
  const [selectedArea, setSelectedArea] = useState<string>(initialArea);
  const [isCreatingPitch, setIsCreatingPitch] = useState<boolean>(false);

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
            <ScheduleMatchButton selectedArea={selectedArea} />

            <Button
              disabled={!selectedArea}
              sx={{ flexShrink: 0, gap: 1 }}
              onClick={() => setIsCreatingPitch(true)}
            >
              <PlaceIcon />
              Adicionar Campo
            </Button>
          </Stack>
          {isCreatingPitch && (
            <RequireAuthModal
              open={isCreatingPitch}
              setOpen={setIsCreatingPitch}
            >
              <CreatePitchModal
                open={isCreatingPitch}
                setOpen={setIsCreatingPitch}
                selectedArea={selectedArea}
              />
            </RequireAuthModal>
          )}
        </Card>

        <MatchList area={selectedArea} />
      </Stack>
    </Container>
  );
}
