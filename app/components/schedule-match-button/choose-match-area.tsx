import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ChooseMatchArea({ areas, onClose, onChoose }: {
  areas: string[];
  onClose: () => void;
  onChoose: (area: string) => void;
}) {
  const t = useTranslations("App.HomeClient");
  const [area, setArea] = useState("");

  return (
    <Dialog open fullWidth maxWidth="xs" onClose={onClose} aria-labelledby="choose-match-area-heading">
      <DialogTitle id="choose-match-area-heading">{t("choose_area")}</DialogTitle>
      <DialogContent sx={{ pt: "12px !important" }}>
        <TextField select fullWidth label={t("district")} value={area} onChange={(event) => setArea(event.target.value)}>
          {areas.map((choice) => <MenuItem key={choice} value={choice}>{choice}</MenuItem>)}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button variant="contained" disabled={!area} onClick={() => onChoose(area)}>{t("continue")}</Button>
      </DialogActions>
    </Dialog>
  );
}
