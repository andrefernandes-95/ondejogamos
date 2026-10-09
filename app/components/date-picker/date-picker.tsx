"use client";

import "dayjs/locale/pt";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ptPT } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function DatePicker({ label, value, onChange }: Props) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="pt"
      localeText={
        ptPT.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DateTimePicker
        timezone="Europe/Lisbon"
        label={label}
        format="DD/MM/YYYY HH:mm"
        disablePast
        value={value ? dayjs.utc(value) : null}
        onChange={(date) => {
          onChange(date?.isValid() ? date.toISOString() : "");
        }}
      />
    </LocalizationProvider>
  );
}
