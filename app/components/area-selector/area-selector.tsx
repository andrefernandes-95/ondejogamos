"use client";

import { Location, LocationWithGameCount } from "@/app/services/locations";
import { Close, Delete, Remove, RemoveCircle } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

interface Props {
  selectedArea: string;
  handleSelectedArea: (value: string) => void;
  data: LocationWithGameCount[];
}

export default function AreaSelector({
  data,
  selectedArea,
  handleSelectedArea,
}: Props) {
  const preparedData: Record<string, number> = {};

  data.forEach((entry) => {
    preparedData[entry.area] =
      (preparedData[entry.area] ?? 0) + entry.game_count;
  });

  return (
    <Stack sx={{ flexDirection: "row", flexGrow: 1 }}>
      <FormControl fullWidth>
        <InputLabel id="select-area">Área</InputLabel>
        <Select
          labelId="select-area"
          id="select-area"
          value={selectedArea}
          label="Área"
          renderValue={(value) => value}
          onChange={({ target: { value } }) => handleSelectedArea(value)}
        >
          {Object.entries(preparedData).map((entry) => (
            <MenuItem
              key={entry[0]}
              value={entry[0]}
              sx={{ justifyContent: "space-between" }}
            >
              {entry[0]}

              <Typography color="primary">
                {entry[1] === 1 ? `1 jogo agendado` : ""}
                {entry[1] > 1 ? `${entry[1]} jogos agendados` : ""}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedArea && (
        <Button
          sx={{ flexShrink: 0, flexGrow: 1 }}
          onClick={() => handleSelectedArea("")}
        >
          <Close />
        </Button>
      )}
    </Stack>
  );
}
