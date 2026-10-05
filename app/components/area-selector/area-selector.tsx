"use client";

import { Location } from "@/app/services/locations";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

interface Props {
  selectedArea: string;
  handleSelectedArea: (value: string) => void;
  data: Location[];
}

export default function AreaSelector({
  data,
  selectedArea,
  handleSelectedArea,
}: Props) {
  const preparedData = [...new Set(data.map((entry) => entry.area))];

  return (
    <FormControl fullWidth>
      <InputLabel id="select-area">Área</InputLabel>
      <Select
        labelId="select-area"
        id="select-area"
        value={selectedArea}
        label="Área"
        onChange={({ target: { value } }) => handleSelectedArea(value)}
      >
        {preparedData.map((entry) => (
          <MenuItem key={entry} value={entry}>
            {entry}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
