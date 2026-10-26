"use client";

import "dayjs/locale/pt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useCallback, useEffect, useId, useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { DatePicker, TimeGrid } from "@mantine/dates";
import { Match } from "@/app/models/match";
import useLocalization from "@/app/hooks/locale";

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
  current_match_id: string;
  current_match_pitch_id: string;
  current_match_duration_in_minutes: number;
}

export default function MatchDatePicker({
  value,
  onChange,
  current_match_id,
  current_match_pitch_id,
  current_match_duration_in_minutes,
}: Props) {
  const isEn = useLocalization() === "EN";
  const id = useId();

  const [loading, setLoading] = useState(false);

  const initial = value ? dayjs(value).tz(TIMEZONE) : null;

  const [day, setDay] = useState<string | null>(
    initial?.format("YYYY-MM-DD") ?? null,
  );

  const [time, setTime] = useState<string | null>(
    initial?.format("HH:mm") ?? null,
  );

  const [showAllTimes, setShowAllTimes] = useState(false);

  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);

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

  const fetchAvailability = useCallback(() => {
    if (!current_match_pitch_id || !day) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const load = async () => {
      try {
        const date = dayjs(day).format("YYYY-MM-DD");
        const nextDate = dayjs(day).add(1, "day").format("YYYY-MM-DD");
        const from = dayjs.tz(date, "Europe/Lisbon").toISOString();
        const until = dayjs.tz(nextDate, "Europe/Lisbon").toISOString();

        const params = new URLSearchParams({
          pitch_id: current_match_pitch_id,
          from,
          until,
        });

        const response = await fetch(`/api/matches/availability?${params}`);

        const matches: Match[] = await response.json();

        const unavailableTimes = matches.flatMap((existingMatch) => {
          if (current_match_id === existingMatch.id) {
            return [];
          }
          const existingMatchStart = dayjs(existingMatch.starts_at).tz(
            TIMEZONE,
          );

          const slots = [];

          for (
            let offset = 0;
            offset < existingMatch.duration_in_minutes;
            offset += 30
          ) {
            slots.push(
              existingMatchStart.add(offset, "minute").format("HH:mm"),
            );
          }

          // Existing Match: 20.00
          // We want to unavailable the slots prior according to our match duration
          // So we for a 60 minute match we block:
          // 19.30
          // And allow 19.00
          // For a 120 m match we block:
          // 19.30, 19.00, 18.30 And we allo 18.00
          for (
            let offset = 0;
            offset < current_match_duration_in_minutes; // While offset is greater than zero
            offset += 30
          ) {
            slots.push(
              existingMatchStart.subtract(offset, "minute").format("HH:mm"),
            );
          }

          return slots;
        });

        setUnavailableTimes(unavailableTimes);
      } catch (e) {
        console.error("Erro ao consultar disponibilidade:", e);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [
    day,
    current_match_pitch_id,
    current_match_id,
    current_match_duration_in_minutes,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    return fetchAvailability();
  }, [fetchAvailability, current_match_pitch_id]);

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
          <Typography>{isEn ? "Match Day" : "Dia do Jogo"}</Typography>

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
          <Typography id={`${id}-time-label`}>
            {isEn ? "Start Time" : "Hora de Início"}
          </Typography>

          <Box
            role="group"
            aria-labelledby={`${id}-time-label`}
            sx={{ maxHeight: 280, overflowY: "auto", p: 0.5 }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
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
                disableTime={unavailableTimes}
              />
            )}
          </Box>

          <Button
            type="button"
            size="small"
            sx={{ alignSelf: "flex-start" }}
            onClick={() => setShowAllTimes((current) => !current)}
          >
            {showAllTimes
              ? isEn
                ? "See common times"
                : "Ver horas habituais"
              : isEn
                ? "See all times"
                : "Ver todas as horas"}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
