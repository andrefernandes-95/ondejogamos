"use client";

import { Location } from "@/app/services/locations";
import { Pitch } from "@/app/services/pitches";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import Image from "next/image";
import React from "react";

interface Props {
  selectedPitch: string;
  handleSelectedPitch: (value: string) => void;
  data: Pitch[];
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
    </Stack>
  );
};

export default function PitchSelector({
  data,
  selectedPitch,
  handleSelectedPitch,
}: Props) {
  const options = [
    ...new Map(data.map((pitch) => [String(pitch.id), pitch])).values(),
  ];

  const value = options.some((pitch) => String(pitch.id) === selectedPitch)
    ? selectedPitch
    : "";

  return (
    <FormControl fullWidth>
      <InputLabel id="pitch-label">Selecionar campo</InputLabel>
      <Select
        labelId="pitch-label"
        id="pitch-select"
        value={value}
        label="Selecionar campo"
        onChange={({ target: { value } }) => handleSelectedPitch(value)}
        renderValue={(id) => {
          const pitch = options.find((entry) => String(entry.id) === id);

          return pitch ? <PitchOption pitch={pitch} /> : null;
        }}
      >
        {options.map((pitch) => (
          <MenuItem key={pitch.id} value={String(pitch.id)}>
            <PitchOption pitch={pitch} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
