import { TextField } from "@mui/material";
import { useTranslations } from "next-intl";

export default function CardUsernameField({ value, onChange }: {
  value: string;
  onChange: (username: string) => void;
}) {
  const t = useTranslations("App.PlayerCard");
  return (
    <TextField
      required fullWidth label={t("username")} value={value}
      onChange={(event) => onChange(event.target.value)}
      helperText={t("username_hint")}
      slotProps={{ htmlInput: { minLength: 3, maxLength: 30, autoComplete: "off", spellCheck: false } }}
    />
  );
}
