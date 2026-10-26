"use client";

import useLocalization from "@/app/hooks/locale";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";

interface Props {
  selectedMunicipality: string;
  onMunicipalitySelected: (value: string) => void;
  data: string[];
  errorMessage?: string;
}

export default function MunicipalitySelector({
  data,
  selectedMunicipality,
  onMunicipalitySelected,
  errorMessage,
}: Props) {
  const isEn = useLocalization() === "EN";

  return (
    <FormControl fullWidth>
      <InputLabel id="select-municipality">
        {isEn ? "Municipality" : "Município"}
      </InputLabel>
      <Select
        labelId="select-municipality"
        id="select-municipality"
        value={selectedMunicipality}
        label={isEn ? "Municipality" : "Município"}
        onChange={({ target: { value } }) => onMunicipalitySelected(value)}
        error={!!errorMessage?.length}
      >
        {data.map((entry) => (
          <MenuItem key={entry} value={entry}>
            {entry}
          </MenuItem>
        ))}
      </Select>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    </FormControl>
  );
}
