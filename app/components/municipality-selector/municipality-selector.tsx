"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

interface Props {
  selectedMunicipality: string;
  setSelectedMunicipality: React.Dispatch<React.SetStateAction<string>>;
  data: string[];
}

export default function MunicipalitySelector({
  data,
  selectedMunicipality,
  setSelectedMunicipality,
}: Props) {
  return (
    <FormControl fullWidth>
      <InputLabel id="select-municipality">Município</InputLabel>
      <Select
        labelId="select-municipality"
        id="select-municipality"
        value={selectedMunicipality}
        label="Município"
        onChange={({ target: { value } }) => setSelectedMunicipality(value)}
      >
        {data.map((entry) => (
          <MenuItem key={entry} value={entry}>
            {entry}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
