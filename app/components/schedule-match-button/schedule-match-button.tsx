"use client";

import { Button, Tooltip } from "@mui/material";
import { useState } from "react";
import CreateMatchModal from "@/app/components/modals/create-match-modal/create-match-modal";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import useLocalization from "@/app/hooks/locale";
import { CallMade, OpenInFull } from "@mui/icons-material";

export default function ScheduleMatchButton({
  selectedArea,
  selectedPitch,
  onAddPitch,
  isSmall = false,
}: {
  selectedArea: string;
  onAddPitch: () => void;
  isSmall?: boolean;
  selectedPitch?: string;
}) {
  const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);

  const isEn = useLocalization() === "EN";

  return (
    <>
      <Tooltip
        title={
          selectedArea?.length
            ? ""
            : isEn
              ? "Select an area first"
              : "Seleciona uma área primeiro"
        }
      >
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          <Button
            disabled={!selectedArea}
            sx={{ flexShrink: 0, gap: 1 }}
            onClick={() => setIsCreatingGame(true)}
            size={isSmall ? "small" : "medium"}
          >
            {!isSmall && <SportsSoccerIcon />}
            {isEn ? "Schedule Game" : "Agendar Jogo"}
            {isSmall && <CallMade sx={{ fontSize: 12 }} />}
          </Button>
        </span>
      </Tooltip>
      {isCreatingGame && (
        <RequireAuthModal open={isCreatingGame} setOpen={setIsCreatingGame}>
          <CreateMatchModal
            selectedArea={selectedArea}
            open={isCreatingGame}
            setOpen={setIsCreatingGame}
            onAddPitch={onAddPitch}
            selectedPitch={selectedPitch}
          />
        </RequireAuthModal>
      )}
    </>
  );
}
