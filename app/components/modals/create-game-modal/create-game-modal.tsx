"use client";

import PitchSelector from "@/app/components/pitch-selector/pitch-selector";
import { useListPitchesForArea } from "@/app/hooks/pitches";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  selectedArea: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formId = "create-pitch-form";

export default function CreateGameModal({
  open,
  setOpen,
  selectedArea,
}: Props) {
  const pitches = useListPitchesForArea(selectedArea);
  const [selectedPitchId, setSelectedPitchId] = useState<string>("");

  const effectivePitchId = pitches.some(
    (pitch) => String(pitch.id) === selectedPitchId,
  )
    ? selectedPitchId
    : pitches[0]
      ? String(pitches[0].id)
      : "";

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
  };

  const handleSelectedPitch = (pitchId: string) => {
    setSelectedPitchId(pitchId);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle
        color="primary"
        sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}
      >
        <PlaceIcon />
        <Typography>Agendar Jogo</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>A agendar jogo em {selectedArea}</DialogContentText>

        <Box component="form" id={formId} onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ py: 2 }}>
            <PitchSelector
              data={pitches}
              selectedPitch={effectivePitchId}
              handleSelectedPitch={handleSelectedPitch}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>

        <Button type="submit" form={formId} variant="contained">
          Agendar Jogo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
