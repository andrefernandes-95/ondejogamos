"use client";

import "dayjs/locale/pt";
import dayjs from "dayjs";
import { LISBON_TIME_ZONE as TIMEZONE, parseLisbonSlot } from "@/app/utils/lisbon-slot";
import { useEffect, useId, useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker, TimeGrid } from "@mantine/dates";
import type { OccupiedMatchSlot } from "@/app/services/pitch-availability";
import { matchSlotsOverlap } from "@/app/utils/match-time-range";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { useTranslations } from "next-intl";

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
  const tApp = useTranslations();
  const tErrors = useTranslations("ApiErrors");
  const id = useId();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    const date = parseLisbonSlot(nextDay, nextTime);
    onChange(date?.toISOString() ?? "");
  };

  useEffect(() => {
    if (!current_match_pitch_id || !day) {
      return;
    }

    const controller = new AbortController();
    async function load(selectedDay: string) {
      setLoading(true);
      setError("");
      try {
        const nextDate = dayjs(selectedDay).add(1, "day").format("YYYY-MM-DD");
        const duration = Number.isFinite(current_match_duration_in_minutes)
          ? Math.max(0, current_match_duration_in_minutes)
          : 0;
        const from = dayjs.tz(selectedDay, TIMEZONE).toISOString();
        const until = dayjs.tz(nextDate, TIMEZONE).add(duration, "minute").toISOString();
        const params = new URLSearchParams({ pitch_id: current_match_pitch_id, from, until });
        const response = await fetch(`/api/matches/availability?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(tErrors(await readApiErrorCodeFromResponse(response)));
        }

        const matches: OccupiedMatchSlot[] = await response.json();
        if (controller.signal.aborted) {
          return;
        }
        const otherMatches = matches.filter(({ id }) => id !== current_match_id);
        setUnavailableTimes(ALL_TIMES.filter((slot) => {
          const start = parseLisbonSlot(selectedDay, slot);
          if (!start) {
            return true;
          }
          return otherMatches.some((match) => matchSlotsOverlap(
            { startsAt: start.toDate(), durationInMinutes: duration },
            { startsAt: match.starts_at, durationInMinutes: match.duration_in_minutes },
          ));
        }));
      } catch (error) {
        if (!controller.signal.aborted) {
          setUnavailableTimes([]);
          setError(error instanceof Error ? error.message : tErrors("INTERNAL_ERROR"));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load(day);
    return () => controller.abort();
  }, [current_match_duration_in_minutes, current_match_id, current_match_pitch_id, day, tErrors]);

  const shouldShowTimes = Boolean(day && current_match_pitch_id);

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
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
          <Typography>{tApp("App.MatchDatePicker.match_day")}</Typography>

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
            {tApp("App.MatchDatePicker.start_time")}
          </Typography>

          <Box
            role="group"
            aria-labelledby={`${id}-time-label`}
            sx={{ maxHeight: 280, overflowY: "auto", p: 0.5 }}
          >
            {shouldShowTimes && loading ? (
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
                disableTime={shouldShowTimes ? unavailableTimes : []}
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
              ? tApp("App.MatchDatePicker.see_common_times")
              : tApp("App.MatchDatePicker.see_all_times")}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
