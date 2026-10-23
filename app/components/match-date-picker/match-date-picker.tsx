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
import { matchTimeRangesOverlap } from "@/app/utils/match-time";

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

  const fetchAvailability = useCallback((signal: AbortSignal) => {
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
        const until = dayjs
          .tz(nextDate, TIMEZONE)
          .add(current_match_duration_in_minutes, "minute")
          .toISOString();

        const params = new URLSearchParams({
          pitch_id: current_match_pitch_id,
          from,
          until,
        });

        const response = await fetch(`/api/matches/availability?${params}`, {
          signal,
        });

        if (!response.ok) {
          throw new Error("Falha ao consultar disponibilidade");
        }

        const matches: Match[] = await response.json();

        const otherMatches = matches.filter(
          (match) => String(match.id) !== String(current_match_id),
        );
        const unavailableTimes = ALL_TIMES.filter((slot) => {
          const candidateStart = dayjs.tz(`${day} ${slot}`, TIMEZONE);
          if (!candidateStart.isValid()) {
            return false;
          }

          return otherMatches.some((match) =>
            matchTimeRangesOverlap(
              {
                startsAt: candidateStart.toISOString(),
                durationInMinutes: current_match_duration_in_minutes,
              },
              {
                startsAt: match.starts_at,
                durationInMinutes: match.duration_in_minutes,
              },
            ),
          );
        });

        if (!signal.aborted) {
          setUnavailableTimes(unavailableTimes);
        }
      } catch (e) {
        if (!signal.aborted) {
          console.error("Erro ao consultar disponibilidade:", e);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
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
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAvailability(controller.signal);

    return () => controller.abort();
  }, [fetchAvailability]);

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
