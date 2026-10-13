"use client";

import { useTranslations } from "next-intl";

import AreaSelector from "@/app/components/area-selector/area-selector";
import CreatePitchModal from "@/app/components/modals/create-pitch-modal/create-pitch-modal";
import { Location, LocationWithGameCount } from "@/app/services/locations";
import { Button, Card, Container, Stack, Tooltip } from "@mui/material";
import { useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";
import { Background } from "@/app/components/background/background";
import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import MatchList from "@/app/components/match-list/match-list";
import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";

interface Props {
  data: LocationWithGameCount[];
  initialArea: string;
}

export default function HomeClient({ data, initialArea }: Props) {
  const t = useTranslations();
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

            <ScheduleMatchButton
              selectedArea={selectedArea}
              onAddPitch={() => setIsCreatingPitch(true)}
            />

            <Tooltip
              title={selectedArea?.length ? "" : t("Common.selectArea")}
            >
              <span style={{ display: "inline-flex", flexShrink: 0 }}>
                <Button
                  disabled={!selectedArea}
                  sx={{ flexShrink: 0, gap: 1 }}
                  onClick={() => setIsCreatingPitch(true)}
                >
                  <PlaceIcon />
                  {t("Pitch.add")}
                </Button>
              </span>
            </Tooltip>
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

        <MatchList
          area={selectedArea}
          onAddPitch={() => setIsCreatingPitch(true)}
        />
      </Stack>
    </Container>
  );
}
