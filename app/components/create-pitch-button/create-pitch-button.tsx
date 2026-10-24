"use client";

import { Tooltip } from "@mui/material";
import React from "react";
import PlaceIcon from "@mui/icons-material/Place";

import CreatePitchModal from "@/app/components/modals/create-pitch-modal/create-pitch-modal";
import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import { Button } from "@mui/material";
import { PitchFull } from "@/app/services/pitches";
import { useTranslations } from "next-intl";

export default function CreatePitchButton({
  selectedArea,
  isCreatingPitch,
  setIsCreatingPitch,
  existingPitch,
  onUpdatePitch,
}: {
  selectedArea: string;
  isCreatingPitch: boolean;
  setIsCreatingPitch: React.Dispatch<React.SetStateAction<boolean>>;
  existingPitch?: PitchFull;
  onUpdatePitch?: () => void;
}) {
  const tApp = useTranslations();

  return (
    <>
      {isCreatingPitch && (
        <RequireAuthModal open={isCreatingPitch} setOpen={setIsCreatingPitch}>
          <CreatePitchModal
            open={isCreatingPitch}
            setOpen={setIsCreatingPitch}
            selectedArea={selectedArea}
            existingPitch={existingPitch}
            onUpdatePitch={onUpdatePitch}
          />
        </RequireAuthModal>
      )}

      <Tooltip
        title={
          selectedArea?.length
            ? ""
            : tApp("App.CreatePitchButton.select_an_area_first")
        }
      >
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          <Button
            disabled={!selectedArea}
            sx={{ flexShrink: 0, gap: 1 }}
            onClick={() => setIsCreatingPitch(true)}
          >
            <PlaceIcon />
            {existingPitch
              ? tApp("App.CreatePitchButton.edit_pitch")
              : tApp("App.CreatePitchButton.add_pitch")}
          </Button>
        </span>
      </Tooltip>
    </>
  );
}
