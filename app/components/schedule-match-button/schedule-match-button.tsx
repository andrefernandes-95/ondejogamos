"use client";

import { Button, Tooltip } from "@mui/material";
import { useState } from "react";
import CreateMatchModal from "@/app/components/modals/create-match-modal/create-match-modal";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import { useTranslations } from "next-intl";

export default function ScheduleMatchButton({
  selectedArea,
  onAddPitch,
}: {
  selectedArea: string;
  onAddPitch: () => void;
}) {
  const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);

  const t = useTranslations("Match");

  return (
    <>
      <Tooltip
        title={selectedArea?.length ? "" : t("selectArea")}
      >
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          <Button
            disabled={!selectedArea}
            sx={{ flexShrink: 0, gap: 1 }}
            onClick={() => setIsCreatingGame(true)}
          >
            <SportsSoccerIcon />
            {t("schedule")}
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
          />
        </RequireAuthModal>
      )}
    </>
  );
}
