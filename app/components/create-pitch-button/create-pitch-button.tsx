"use client";

import { Tooltip } from "@mui/material";
import React from "react";
import PlaceIcon from "@mui/icons-material/Place";

import CreatePitchModal from "@/app/components/modals/create-pitch-modal/create-pitch-modal";
import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import { Button } from "@mui/material";
import useLocalization from "@/app/hooks/locale";
import { PitchFull } from "@/app/services/pitches";

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
  const isEn = useLocalization() === "EN";

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
            : isEn
              ? "Select an area first"
              : "Seleciona uma área primeiro"
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
              ? isEn
                ? "Edit Pitch"
                : "Editar Campo"
              : isEn
                ? "Add Pitch"
                : "Adicionar Campo"}
          </Button>
        </span>
      </Tooltip>
    </>
  );
}
