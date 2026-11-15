"use client";

import type { LocationWithGameCount } from "@/app/services/locations";
import { MenuItem, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface Props {
  selectedArea: string;
  handleSelectedArea: (value: string) => void;
  data: LocationWithGameCount[];
}

export default function AreaSelector({ data, selectedArea, handleSelectedArea }: Props) {
  const t = useTranslations("App.HomeClient");
  const counts = new Map<string, number>();
  for (const entry of data) {
    counts.set(entry.area, (counts.get(entry.area) ?? 0) + entry.game_count);
  }

  return (
    <TextField
      select fullWidth label={t("district")} value={selectedArea}
      onChange={(event) => handleSelectedArea(event.target.value)}
      slotProps={{
        inputLabel: { shrink: true },
        select: { displayEmpty: true, renderValue: (value) => value ? String(value) : t("all_districts") },
      }}
      sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.paper" } }}
    >
      <MenuItem value="">{t("all_districts")}</MenuItem>
      {[...counts].map(([area, count]) => (
        <MenuItem key={area} value={area} sx={{ justifyContent: "space-between", gap: 2 }}>
          {area}
          {count > 0 && <Typography variant="caption" color="primary">{t("match_count", { count })}</Typography>}
        </MenuItem>
      ))}
    </TextField>
  );
}
