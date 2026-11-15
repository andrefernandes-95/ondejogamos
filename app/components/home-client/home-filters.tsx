import AreaSelector from "@/app/components/area-selector/area-selector";
import type { LocationWithGameCount } from "@/app/services/locations";
import { MenuItem, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

interface Props {
  data: LocationWithGameCount[];
  area: string;
  municipality: string;
  onAreaChange: (area: string) => void;
  onMunicipalityChange: (municipality: string) => void;
}

export default function HomeFilters({ data, area, municipality, onAreaChange, onMunicipalityChange }: Props) {
  const t = useTranslations("App.HomeClient");
  const municipalities = [...new Set(data.filter((item) => item.area === area).map((item) => item.municipality))]
    .sort((first, second) => first.localeCompare(second, "pt"));

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
      <AreaSelector data={data} selectedArea={area} handleSelectedArea={onAreaChange} />
      <TextField
        select fullWidth disabled={!area}
        label={t("municipality")}
        value={municipality}
        onChange={(event) => onMunicipalityChange(event.target.value)}
        slotProps={{ inputLabel: { shrink: true }, select: { displayEmpty: true } }}
        sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.paper" } }}
      >
        <MenuItem value="">{t("all_municipalities")}</MenuItem>
        {municipalities.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
      </TextField>
    </Stack>
  );
}
