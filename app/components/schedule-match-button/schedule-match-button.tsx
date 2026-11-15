"use client";

import { Button } from "@mui/material";
import { useState } from "react";
import CreateMatchModal from "@/app/components/modals/create-match-modal/create-match-modal";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import { CallMade } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import ChooseMatchArea from "./choose-match-area";

interface Props {
  selectedArea: string;
  onAddPitch: () => void;
  isSmall?: boolean;
  selectedPitch?: string;
  areaChoices?: string[];
  onAreaChosen?: (area: string) => void;
  prominent?: boolean;
}

export default function ScheduleMatchButton({
  selectedArea, selectedPitch, onAddPitch, areaChoices, onAreaChosen,
  isSmall = false, prominent = false,
}: Props) {
  const t = useTranslations("App.ScheduleMatchButton");
  const tHome = useTranslations("App.HomeClient");
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [choosingArea, setChoosingArea] = useState(false);

  return (
    <>
      <Button
        variant={prominent ? "contained" : "text"}
        startIcon={isSmall ? undefined : <SportsSoccerIcon />}
        endIcon={isSmall ? <CallMade sx={{ fontSize: 12 }} /> : undefined}
        disabled={!selectedArea && !areaChoices?.length}
        onClick={() => selectedArea ? setIsCreatingGame(true) : setChoosingArea(true)}
        size={isSmall ? "small" : "medium"}
      >
        {prominent ? tHome("create_match") : t("schedule_game")}
      </Button>
      {choosingArea && areaChoices && (
        <ChooseMatchArea areas={areaChoices} onClose={() => setChoosingArea(false)} onChoose={(area) => {
          setChoosingArea(false);
          onAreaChosen?.(area);
          setIsCreatingGame(true);
        }} />
      )}
      {isCreatingGame && (
        <RequireAuthModal open={isCreatingGame} setOpen={setIsCreatingGame}>
          <CreateMatchModal selectedArea={selectedArea} selectedPitch={selectedPitch}
            open={isCreatingGame} setOpen={setIsCreatingGame} onAddPitch={onAddPitch} />
        </RequireAuthModal>
      )}
    </>
  );
}
