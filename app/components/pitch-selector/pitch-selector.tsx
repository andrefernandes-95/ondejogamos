"use client";

import { Pitch } from "@/app/services/pitches";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";

interface Props {
  selectedPitch: string;
  handleSelectedPitch: (pitchId: number) => void;
  data: Pitch[];
  errorMessage?: string;
}

const PitchOption = ({ pitch }: { pitch: Pitch }) => {
  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
      {pitch.image_url && (
        <Image
          src={pitch.image_url}
          alt={pitch.name}
          width={80}
          height={80}
          style={{
            objectFit: "cover",
            borderRadius: 6,
          }}
        />
      )}

      {pitch.name}

      {pitch.municipality && (
        <Typography variant="body2" color="text.secondary">
          {pitch.municipality}
        </Typography>
      )}
    </Stack>
  );
};

export default function PitchSelector({
  data,
  selectedPitch,
  handleSelectedPitch,
  errorMessage,
}: Props) {
  const options = [
    ...new Map(data.map((pitch) => [String(pitch.id), pitch])).values(),
  ];

  const value = options.find((pitch) => String(pitch.id) === selectedPitch);

  return (
    <Stack sx={{ flexDirection: "column" }}>
      <Autocomplete
        multiple={false}
        value={value}
        options={options}
        filterOptions={(options, state) => {
          const query = state.inputValue.toLowerCase().trim();
          if (!query) {
            return options;
          }

          return options.filter((pitch) => {
            const name = pitch.name?.toLowerCase() ?? "";
            const municipality =
              pitch.municipality?.toLowerCase()?.trim() ?? "";

            return name.includes(query) || municipality.includes(query);
          });
        }}
        onChange={(_, newValue) =>
          newValue
            ? handleSelectedPitch(newValue!.id)
            : handleSelectedPitch(null!)
        }
        renderOption={(props, pitch) => {
          return pitch ? (
            <li {...props} key={pitch.id}>
              <PitchOption pitch={pitch} />
            </li>
          ) : null;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecionar campo"
            placeholder="Pesquisar por campo ou localização"
          />
        )}
        noOptionsText="Sem resultados"
        renderValue={(value) => value && <PitchOption pitch={value} />}
      />
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    </Stack>
  );
}
