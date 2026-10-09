"use client";

import { Button } from "@mui/material";
import { useState } from "react";
import CreateGameModal from "@/app/components/modals/create-game-modal/create-game-modal";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";

export default function ScheduleMatchButton({
  selectedArea,
}: {
  selectedArea: string;
}) {
  const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);

  return (
    <>
      <Button
        disabled={!selectedArea}
        sx={{ flexShrink: 0, gap: 1 }}
        onClick={() => setIsCreatingGame(true)}
      >
        <SportsSoccerIcon />
        Agendar Jogo
      </Button>
      {isCreatingGame && (
        <RequireAuthModal open={isCreatingGame} setOpen={setIsCreatingGame}>
          <CreateGameModal
            selectedArea={selectedArea}
            open={isCreatingGame}
            setOpen={setIsCreatingGame}
          />
        </RequireAuthModal>
      )}
    </>
  );
}
