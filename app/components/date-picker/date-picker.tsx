"use client";

import "dayjs/locale/pt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useId, useState } from "react";
import { Stack, Box, Typography, Button } from "@mui/material";
import { DatePicker, TimeGrid } from "@mantine/dates";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "Europe/Lisbon";

const COMMON_TIMES = [
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

// 00:00 until 23:30
const ALL_TIMES = Array.from({ length: 48 }, (_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, "0");
  const minutes = index % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MatchDatePicker({ value, onChange }: Props) {
  const id = useId();

  const initial = value ? dayjs(value).tz(TIMEZONE) : null;

  const [day, setDay] = useState<string | null>(
    initial?.format("YYYY-MM-DD") ?? null,
  );

  const [time, setTime] = useState<string | null>(
    initial?.format("HH:mm") ?? null,
  );

  const [showAllTimes, setShowAllTimes] = useState(false);

  const times = showAllTimes ? ALL_TIMES : COMMON_TIMES;

  const updateValue = (nextDay: string | null, nextTime: string | null) => {
    if (!nextDay || !nextTime) {
      onChange("");
      return;
    }

    const localValue = `${nextDay} ${nextTime}`;
    const date = dayjs.tz(localValue, TIMEZONE);

    if (!date.isValid() || date.format("YYYY-MM-DD HH:mm") !== localValue) {
      onChange("");
      return;
    }

    onChange(date.toISOString());
  };

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "auto minmax(0, 1fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Stack spacing={1}>
          <Typography>Dia do Jogo</Typography>

          <DatePicker
            value={day}
            minDate={dayjs().tz(TIMEZONE).format("YYYY-MM-DD")}
            onChange={(nextDay) => {
              setDay(nextDay);
              updateValue(nextDay, time);
            }}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography id={`${id}-time-label`}>Hora de Início</Typography>

          <Box
            role="group"
            aria-labelledby={`${id}-time-label`}
            sx={{ maxHeight: 280, overflowY: "auto", p: 0.5 }}
          >
            <TimeGrid
              value={time}
              data={times}
              onChange={(nextTime) => {
                setTime(nextTime);
                updateValue(day, nextTime);
              }}
              simpleGridProps={{
                cols: 3,
                spacing: "xs",
              }}
            />
          </Box>

          <Button
            type="button"
            size="small"
            sx={{ alignSelf: "flex-start" }}
            onClick={() => setShowAllTimes((current) => !current)}
          >
            {showAllTimes ? "Ver horas habituais" : "Ver todas as horas"}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
