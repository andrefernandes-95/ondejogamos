"use client";

import AreaSelector from "@/app/components/area-selector/area-selector";
import CreateGameForm from "@/app/components/create-game-form/create-game-form";
import CreatePitchModal from "@/app/components/modals/create-pitch-modal/create-pitch-modal";
import { Location } from "@/app/services/locations";
import { Button, Container, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";

interface Props {
  data: Location[];
}

export default function HomeClient({ data }: Props) {
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);
  const [isCreatingPitch, setIsCreatingPitch] = useState<boolean>(false);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack sx={{ gap: 2 }}>
        <Typography variant="h5">Jogos Hoje</Typography>
        <Divider />

        <Stack direction="row" sx={{ gap: 2 }}>
          <AreaSelector
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            data={data}
          />

          <Button
            disabled={!selectedArea}
            sx={{ flexShrink: 0 }}
            onClick={() => setIsCreatingGame(true)}
          >
            Criar Jogo
          </Button>

          <Button
            disabled={!selectedArea}
            sx={{ flexShrink: 0 }}
            onClick={() => setIsCreatingPitch(true)}
          >
            <PlaceIcon />
            Adicionar Campo
          </Button>
        </Stack>
        {isCreatingGame && <CreateGameForm selectedArea={selectedArea} />}
        {isCreatingPitch && (
          <CreatePitchModal
            open={isCreatingPitch}
            setOpen={setIsCreatingPitch}
            selectedArea={selectedArea}
          />
        )}
      </Stack>
    </Container>
  );
}
