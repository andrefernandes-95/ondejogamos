"use client";

import { Button, Tooltip } from "@mui/material";
import { useState } from "react";
import CreateMatchModal from "@/app/components/modals/create-match-modal/create-match-modal";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import { Add, CallMade } from "@mui/icons-material";
import { useTranslations } from "next-intl";

export default function ScheduleMatchButton({
  selectedArea,
  selectedPitch,
  onAddPitch,
  isSmall = false,
  onChooseArea,
}: {
  selectedArea: string;
  onAddPitch: () => void;
  isSmall?: boolean;
  selectedPitch?: string;
  onChooseArea?: () => void;
}) {
  const tApp = useTranslations();
  const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);

  return (
    <>
      <Tooltip
        title={
          selectedArea?.length || onChooseArea
            ? ""
            : tApp("App.ScheduleMatchButton.select_an_area_first")
        }
      >
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          <Button
            disabled={!selectedArea && !onChooseArea}
            variant={onChooseArea ? "contained" : "text"}
            sx={{ flexShrink: 0, gap: 1 }}
            onClick={() => selectedArea ? setIsCreatingGame(true) : onChooseArea?.()}
            size={isSmall ? "small" : "medium"}
          >
            {onChooseArea ? <Add fontSize="small" /> : !isSmall && <SportsSoccerIcon />}
            {onChooseArea ? tApp("App.Agenda.schedule") : tApp("App.ScheduleMatchButton.schedule_game")}
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
