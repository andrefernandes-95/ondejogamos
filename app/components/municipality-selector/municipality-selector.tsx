"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import { useTranslations } from "next-intl";

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
  const tApp = useTranslations();

  return (
    <FormControl fullWidth>
      <InputLabel id="select-municipality">
        {tApp("App.MunicipalitySelector.municipality")}
      </InputLabel>
      <Select
        labelId="select-municipality"
        id="select-municipality"
        value={selectedMunicipality}
        label={tApp("App.MunicipalitySelector.municipality")}
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
