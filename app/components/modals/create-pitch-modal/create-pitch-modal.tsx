"use client";

import MunicipalitySelector from "@/app/components/municipality-selector/municipality-selector";
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

export default function CreatePitchModal({
  open,
  setOpen,
  selectedArea,
}: Props) {
  const [municipalitiesForArea, setMunicipalitiesForArea] = useState<string[]>(
    [],
  );

  const [name, setName] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [mapsUrl, setMapsUrl] = useState<string>("");

  useEffect(() => {
    const fetchMunicipalitiesForArea = async () => {
      const response = await fetch(
        `/api/municipalities?area=${encodeURIComponent(selectedArea)}`,
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar municípios");
      }

      const municipalities = await response.json();

      setMunicipalitiesForArea(municipalities);
    };
    fetchMunicipalitiesForArea();
  }, [
    // Run every time the area changes
    selectedArea,
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("area", selectedArea);
    formData.append("municipality", municipality);
    formData.append("maps_url", mapsUrl);

    if (file) {
      formData.append("image", file);
    }

    await fetch(`/api/pitches`, { method: "POST", body: formData });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        color="primary"
        sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}
      >
        <PlaceIcon />
        <Typography variant="h5">Adicionar Campo</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Adiciona um novo campo a {selectedArea}
        </DialogContentText>

        <Box component="form" id={formId} onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ py: 2 }}>
            <TextField
              autoFocus
              required
              id="name"
              name="name"
              label="Nome do campo"
              type="text"
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <MunicipalitySelector
              data={municipalitiesForArea}
              selectedMunicipality={municipality}
              setSelectedMunicipality={setMunicipality}
            />

            {file ? (
              <Stack
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1">{file.name}</Typography>
                <Button onClick={() => setFile(null)}>
                  <Delete />
                </Button>
              </Stack>
            ) : (
              <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUpload />}
              >
                Carregar imagem
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setFile(file);
                    }
                  }}
                />
              </Button>
            )}

            <TextField
              autoFocus
              required
              id="mapsUrl"
              name="mapsUrl"
              label="Link do Google Maps"
              type="text"
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => setMapsUrl(e.target.value)}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>

        <Button type="submit" form={formId} variant="contained">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
