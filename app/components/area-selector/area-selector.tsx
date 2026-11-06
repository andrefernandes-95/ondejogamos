"use client";

import { LocationWithGameCount } from "@/app/services/locations";
import { Close } from "@mui/icons-material";
import { useTranslations } from "next-intl";
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
  const tApp = useTranslations();
  const preparedData: Record<string, number> = {};

  data.forEach((entry) => {
    preparedData[entry.area] =
      (preparedData[entry.area] ?? 0) + entry.game_count;
  });

  return (
    <Stack sx={{ flexDirection: "row", flexGrow: 1 }}>
      <FormControl fullWidth>
        <InputLabel id="select-area">{tApp("App.AreaSelector.area")}</InputLabel>
        <Select
          labelId="select-area"
          id="select-area"
          value={selectedArea}
          label={tApp("App.AreaSelector.area")}
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
                  ? tApp("App.AreaSelector.1_game_scheduled")
                  : ""}
                {entry[1] > 1
                  ? tApp("App.AreaSelector.games_scheduled", { count: entry[1] })
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
