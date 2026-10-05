"use client";

import MunicipalitySelector from "@/app/components/municipality-selector/municipality-selector";
import { useListPitchesForArea } from "@/app/hooks/pitches";
import { Pitch } from "@/app/services/pitches";
import { CloudUpload, Delete } from "@mui/icons-material";
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
  TextField,
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        color="primary"
        sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}
      >
        <PlaceIcon />
        <Typography variant="h5">Agendar Jogo</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>A agendar jogo em {selectedArea}</DialogContentText>

        <Box component="form" id={formId} onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ py: 2 }}></Stack>
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
