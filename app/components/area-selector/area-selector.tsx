import type { LocationWithGameCount } from "@/app/services/locations";
import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface Props {
  data: LocationWithGameCount[];
  area: string;
  municipality: string;
  districtOpen: boolean;
  setDistrictOpen: (open: boolean) => void;
  onAreaChange: (area: string) => void;
  onMunicipalityChange: (municipality: string) => void;
  requireArea?: boolean;
}

export function GameCount({ count }: { count: number }) {
  const t = useTranslations("App.Agenda");
  if (count <= 0) return null;

  return (
    <Typography variant="caption" color="text.secondary">
      {t("game_count", { count })}
    </Typography>
  );
}

export default function AreaSelector({
  data, area, municipality, districtOpen, setDistrictOpen, onAreaChange, onMunicipalityChange, requireArea,
}: Props) {
  const t = useTranslations("App.Agenda");
  const counts = new Map<string, number>();
  for (const location of data) {
    counts.set(location.area, (counts.get(location.area) ?? 0) + location.game_count);
  }
  const municipalities = data.filter((location) => location.area === area);

  return (
    <Stack direction="row" spacing={1} sx={{ gridArea: "filters", minWidth: 0 }}>
      <FormControl fullWidth size="small" sx={{ minWidth: 0 }}>
        <InputLabel id="agenda-area-label" shrink>{t("district")}</InputLabel>
        <Select value={area} labelId="agenda-area-label" id="agenda-area"
          label={t("district")} displayEmpty renderValue={(value) => value || t("all")}
          open={districtOpen} onOpen={() => setDistrictOpen(true)} onClose={() => setDistrictOpen(false)}
          onChange={(event) => onAreaChange(event.target.value)}
          sx={{ minHeight: 48 }}>
          {(!requireArea || !counts.size) && <MenuItem value="">{t("all")}</MenuItem>}
          {[...counts].map(([name, count]) => (
            <MenuItem key={name} value={name} sx={{ justifyContent: "space-between", gap: 2 }}>
              {name}
              {!requireArea && <GameCount count={count} />}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="small" sx={{ minWidth: 0 }} disabled={!municipalities.length}>
        <InputLabel id="agenda-municipality-label" shrink>{t("municipality")}</InputLabel>
        <Select value={municipality} labelId="agenda-municipality-label" id="agenda-municipality"
          label={t("municipality")} displayEmpty renderValue={(value) => value || t("all")}
          onChange={(event) => onMunicipalityChange(event.target.value)} sx={{ minHeight: 48 }}>
          <MenuItem value="">{t("all")}</MenuItem>
          {municipalities.map((location) => (
            <MenuItem key={location.municipality} value={location.municipality}
              sx={{ justifyContent: "space-between", gap: 2 }}>
              {location.municipality}
              {!requireArea && <GameCount count={location.game_count} />}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
