"use client";

import AreaSelector from "@/app/components/area-selector/area-selector";
import CreatePitchModal from "@/app/components/modals/create-pitch-modal/create-pitch-modal";
import { Location } from "@/app/services/locations";
import {
  Button,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";
import CreateGameModal from "@/app/components/modals/create-game-modal/create-game-modal";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { Logo } from "@/app/components/logo/logo";
import { Background } from "@/app/components/background/background";
import { getPreferedArea, savePreferedArea } from "@/app/utils/constants";
interface Props {
  data: Location[];
}

export default function HomeClient({ data }: Props) {
  const [selectedArea, setSelectedArea] = useState<string>(getPreferedArea());
  const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);
  const [isCreatingPitch, setIsCreatingPitch] = useState<boolean>(false);

  const handleSelectedArea = (selected: string) => {
    savePreferedArea(selected);
    setSelectedArea(selected);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Background />
      <Stack sx={{ gap: 2 }}>
        <Logo />
        <Card sx={{ p: 4 }} variant="outlined">
          <Stack direction="row" sx={{ gap: 2 }}>
            <AreaSelector
              selectedArea={selectedArea}
              handleSelectedArea={handleSelectedArea}
              data={data}
            />

            <Button
              disabled={!selectedArea}
              sx={{ flexShrink: 0, gap: 1 }}
              onClick={() => setIsCreatingGame(true)}
            >
              <SportsSoccerIcon />
              Agendar Jogo
            </Button>

            <Button
              disabled={!selectedArea}
              sx={{ flexShrink: 0, gap: 1 }}
              onClick={() => setIsCreatingPitch(true)}
            >
              <PlaceIcon />
              Adicionar Campo
            </Button>
          </Stack>
          {isCreatingGame && (
            <CreateGameModal
              selectedArea={selectedArea}
              open={isCreatingGame}
              setOpen={setIsCreatingGame}
            />
          )}
          {isCreatingPitch && (
            <CreatePitchModal
              open={isCreatingPitch}
              setOpen={setIsCreatingPitch}
              selectedArea={selectedArea}
            />
          )}
        </Card>
      </Stack>
    </Container>
  );
}
