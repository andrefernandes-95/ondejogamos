"use client";

import useLocalization from "@/app/hooks/locale";
import { LocationWithGameCount } from "@/app/services/locations";
import { Close } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

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

  const isEn = useLocalization() === "EN";

  return (
    <Stack sx={{ flexDirection: "row", flexGrow: 1 }}>
      <FormControl fullWidth>
        <InputLabel id="select-area">{isEn ? "Area" : "Área"}</InputLabel>
        <Select
          labelId="select-area"
          id="select-area"
          value={selectedArea}
          label={isEn ? "Area" : "Área"}
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
                {entry[1] === 1
                  ? isEn
                    ? `1 game scheduled`
                    : `1 jogo agendado`
                  : ""}
                {entry[1] > 1
                  ? isEn
                    ? `${entry[1]} games scheduled`
                    : `${entry[1]} jogos agendados`
                  : ""}
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
