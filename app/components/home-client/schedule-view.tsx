"use client";

import CreatePitchButton from "@/app/components/create-pitch-button/create-pitch-button";
import ControlLabel from "@/app/components/control-label/control-label";
import MatchDurationInput from "@/app/components/match-duration-input/match-duration-input";
import { MatchFormatPicker } from "@/app/components/match-format-input/match-format-input";
import CreateMatchModal from "@/app/components/modals/create-match-modal/create-match-modal";
import { softEntrance } from "@/app/design/motion";
import { usePitchSlots } from "@/app/hooks/pitch-slots";
import { authClient } from "@/app/lib/auth-client";
import type { LocationWithGameCount } from "@/app/services/locations";
import { shiftAgendaDay, validAgendaDay } from "@/app/utils/agenda-date";
import { matchesPitchSearch, normalizeLocationSearch, readScheduleOptions, readScheduleSlot, scheduleDraftKeys, updateHomeSearch } from "@/app/utils/home-schedule";
import { parseLisbonSlot } from "@/app/utils/lisbon-slot";
import { AppRoutes } from "@/app/utils/routes";
import { ExpandMoreRounded, Search } from "@mui/icons-material";
import { alpha, Alert, Autocomplete, Box, Button, CircularProgress, createFilterOptions, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import SchedulePitchRow from "./schedule-pitch-row";

const filterLocationOptions = createFilterOptions<string>({ limit: 12 });

export default function ScheduleView({ data, initialArea, today }: {
  data: LocationWithGameCount[];
  initialArea: string;
  today: string;
}) {
  const t = useTranslations("App.HomeSchedule");
  const agenda = useTranslations("App.Agenda");
  const tError = useTranslations("ApiErrors");
  const router = useRouter();
  const search = useSearchParams();
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const draft = readScheduleSlot(search);
  const draftOptions = readScheduleOptions(search);
  const areas = [...new Set(data.map(({ area }) => area))];
  const draftArea = areas.find((item) => item === search.get("scheduleArea"));
  const [area, setArea] = useState(draftArea ?? (initialArea || areas.find((item) => item === "Santarém") || areas[0] || ""));
  const [query, setQuery] = useState(area);
  const [timeError, setTimeError] = useState(false);
  const [isCreatingPitch, setIsCreatingPitch] = useState(false);
  const { register, control, setValue } = useForm({
    defaultValues: { day: draft?.day ?? shiftAgendaDay(today, 1), ...draftOptions },
  });
  const [day, duration, format] = useWatch({ control, name: ["day", "duration", "format"] });
  const { ref: dateRef, ...dateInput } = register("day");
  const { data: session, isPending, error: sessionError } = authClient.useSession();
  const validDay = validAgendaDay(day) && day >= today;
  const { pitches, loading, error, retry } = usePitchSlots(draftArea ?? area, validDay ? day : "", duration);
  const selectedPitch = pitches.find((pitch) => String(pitch.id) === draft?.pitchId);
  const results = pitches.filter((pitch) => matchesPitchSearch({ ...pitch, area }, query));

  function closeConfirmation() {
    updateHomeSearch(Object.fromEntries(scheduleDraftKeys.map((key) => [key, null])), true);
    retry();
  }

  function changeLocation(value: string) {
    setQuery(value);
    const normalized = normalizeLocationSearch(value);
    const exactArea = areas.find((item) => normalizeLocationSearch(item) === normalized);
    const exactTown = data.find((item) => normalizeLocationSearch(`${item.municipality}, ${item.area}`) === normalized);
    const townAreas = [...new Set(data.filter((item) => normalizeLocationSearch(item.municipality) === normalized).map((item) => item.area))];
    const nextArea = exactArea ?? exactTown?.area ?? (townAreas.length === 1 ? townAreas[0] : undefined);
    if (nextArea) {
      setArea(nextArea);
    }
  }

  function selectPitch(pitchId: string, time: string) {
    const startsAt = parseLisbonSlot(day, time);
    if (!startsAt || startsAt.valueOf() <= Date.now()) {
      setTimeError(true);
      return;
    }
    setTimeError(false);
    updateHomeSearch({
      view: "schedule", scheduleArea: area, schedulePitch: pitchId, scheduleDay: day, scheduleTime: time,
      scheduleFormat: format, scheduleDuration: String(duration),
    });
  }

  return (
    <Stack spacing={3}>
      {/* Foto de loïc pauwels, Unsplash / Zg7bpHqJntg. */}
      <Box sx={{
        position: "relative", isolation: "isolate", py: { xs: 0, md: 5 },
        "&::before": {
          content: '""', position: "absolute", zIndex: -1, inset: { xs: "0 0 auto 0", md: "0 0 0 43%" },
          height: { xs: 150, sm: 174, md: "auto" }, borderRadius: { xs: 3, md: 4 },
          backgroundImage: {
            xs: "linear-gradient(110deg, #081a3eeb 5%, #102449a8 62%, #0b20453b), url(/schedule-hero.jpg)",
            md: "linear-gradient(90deg, #fff 0%, #ffffff80 22%, #fff0 54%), url(/schedule-hero.jpg)",
          },
          backgroundSize: "cover", backgroundPosition: { xs: "center 68%", md: "center 65%" },
        },
      }}>
        <Stack spacing={0.75} sx={{
          minHeight: { xs: 150, sm: 174, md: 0 }, justifyContent: "center", px: { xs: 1.75, md: 0 },
        }}>
          <Typography component="h1" sx={{
            color: { xs: "common.white", md: "text.primary" },
            fontSize: { xs: "clamp(1.75rem, 8vw, 2.8rem)", md: "clamp(3.35rem, 6vw, 4.75rem)" },
            lineHeight: 1.05, fontWeight: 900, letterSpacing: "-.055em",
          }}>
            {t.rich("heading", { blue: (text) => (
              <Box component="span" sx={{ color: { xs: "#cfdeff", md: "primary.main" } }}>{text}</Box>
            ) })}
          </Typography>
          <Typography sx={{ color: { xs: "common.white", md: "text.secondary" }, fontSize: { xs: "0.875rem", md: "1.15rem" } }}>
            {t("subheading")}
          </Typography>
        </Stack>
        <Box component="form" onSubmit={(event) => {
          event.preventDefault();
          resultsHeading.current?.focus();
        }} sx={(theme) => ({
          display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "155px minmax(0,1fr) auto" },
          "@media (max-width: 359px)": { gridTemplateColumns: "minmax(0,1fr)" },
          gap: 1.25, mt: { xs: 1.5, md: 3 }, p: { xs: 0, md: 1.75 }, maxWidth: 730, alignItems: "end", borderRadius: 3,
          bgcolor: { xs: "transparent", md: alpha(theme.palette.background.paper, 0.83) },
          border: { xs: 0, md: 1 }, borderColor: { md: alpha(theme.palette.common.white, 0.9) },
          boxShadow: { md: `0 8px 26px ${alpha(theme.palette.text.primary, 0.13)}` },
          backdropFilter: { md: "blur(12px)" },
          "& .MuiOutlinedInput-root": {
            minHeight: 54,
            bgcolor: { xs: "background.paper", md: alpha(theme.palette.background.paper, 0.65) },
          },
        })}>
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <ControlLabel htmlFor="schedule-day">{t("day")}</ControlLabel>
            <TextField {...dateInput} id="schedule-day" inputRef={dateRef} type="date" required
              slotProps={{ htmlInput: { min: today } }} />
          </Stack>
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <ControlLabel htmlFor="schedule-place">{t("where")}</ControlLabel>
            <Autocomplete id="schedule-place" freeSolo disableClearable forcePopupIcon inputValue={query}
              options={[...areas, ...data.map((item) => `${item.municipality}, ${item.area}`)]}
              filterOptions={filterLocationOptions} popupIcon={<ExpandMoreRounded fontSize="small" />}
              openText={t("show_locations")} closeText={t("hide_locations")}
              onInputChange={(_, value) => changeLocation(value)}
              renderInput={(params) => <TextField {...params} />} />
          </Stack>
          <Button type="submit" variant="contained" size="large" startIcon={<Search />}
            sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}>
            {t("find_pitches")}
          </Button>
        </Box>
      </Box>
      <Stack direction="row" sx={{ alignItems: "flex-start", flexWrap: "wrap", gap: 1.5 }}>
        <MatchFormatPicker value={format} onChange={(value) => setValue("format", value)} />
        <MatchDurationInput value={duration} onChange={(value) => setValue("duration", Number(value))}
          presets={[...new Set([30, 45, 60, 90, 120, duration])].sort((a, b) => a - b)} />
      </Stack>
      <Box component="section" aria-labelledby="schedule-results">
        <Stack direction="row" sx={{ mb: 1.5, alignItems: "baseline", flexWrap: "wrap", gap: 1.5 }}>
          <Typography ref={resultsHeading} id="schedule-results" tabIndex={-1} component="h2" variant="h5">{t("free_times")}</Typography>
          <Typography variant="body2" color="text.secondary" aria-live="polite">
            {validDay && !loading && !error && t("pitch_count", { count: results.length })}
          </Typography>
        </Stack>
        {(!validDay || timeError) && <Alert severity="warning">{t("invalid_time")}</Alert>}
        {loading && <CircularProgress size={24} aria-label={t("loading")} />}
        {error && <Alert severity="error" action={<Button onClick={retry}>{agenda("retry")}</Button>}>{tError(error)}</Alert>}
        {validDay && !loading && !error && !results.length && <Typography color="text.secondary">{t("no_pitches")}</Typography>}
        <Stack component="ul" spacing={{ xs: 1.25, sm: 1.5 }} sx={{ ...softEntrance, m: 0, p: 0 }} key={loading ? "loading" : "ready"}>
          {results.map((pitch) => <SchedulePitchRow key={pitch.id} pitch={pitch} onSelect={(time) => selectPitch(String(pitch.id), time)} />)}
        </Stack>
        {validDay && !loading && !error && area && !pitches.length && (
          <CreatePitchButton selectedArea={area} isCreatingPitch={isCreatingPitch} setIsCreatingPitch={setIsCreatingPitch} />
        )}
      </Box>
      {draft && validDay && !loading && !error && !selectedPitch && (
        <Alert severity="warning" onClose={closeConfirmation}>{t("pitch_unavailable")}</Alert>
      )}
      {draft && sessionError && <Alert severity="error">{t("session_error")}</Alert>}
      {draft && isPending && <CircularProgress size={24} aria-label={t("loading")} />}
      {draft && !isPending && !sessionError && selectedPitch && (
        <CreateMatchModal key={search.toString()} open setOpen={closeConfirmation} selectedArea={draftArea ?? area}
          slot={{ pitchId: draft.pitchId, startsAt: draft.startsAt, name: selectedPitch.name, municipality: selectedPitch.municipality, ...draftOptions }}
          authReturnTo={session ? undefined : `/?${search.toString()}`}
          onCreated={(matchId) => router.replace(AppRoutes.MATCH_DETAILS(matchId))} />
      )}
    </Stack>
  );
}
