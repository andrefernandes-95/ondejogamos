"use client";

import AreaSelector from "@/app/components/area-selector/area-selector";
import CreatePitchButton from "@/app/components/create-pitch-button/create-pitch-button";
import MatchPitchPhoto from "@/app/components/match-card/match-pitch-photo";
import CreateMatchModal from "@/app/components/modals/create-match-modal/create-match-modal";
import { useListPitchesForArea } from "@/app/hooks/pitches";
import { authClient } from "@/app/lib/auth-client";
import type { LocationWithGameCount } from "@/app/services/locations";
import { shiftAgendaDay } from "@/app/utils/agenda-date";
import { matchesPitchSearch, readScheduleSlot, updateHomeSearch } from "@/app/utils/home-schedule";
import { parseLisbonSlot } from "@/app/utils/lisbon-slot";
import { AppRoutes } from "@/app/utils/routes";
import { ArrowForward } from "@mui/icons-material";
import { Alert, Box, Button, ButtonBase, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ScheduleView({ data, initialArea, today }: {
  data: LocationWithGameCount[];
  initialArea: string;
  today: string;
}) {
  const t = useTranslations("App.HomeSchedule");
  const agenda = useTranslations("App.Agenda");
  const router = useRouter();
  const search = useSearchParams();
  const draft = readScheduleSlot(search);
  const draftArea = data.find((location) => location.area === search.get("scheduleArea"))?.area;
  const [chosenArea, setArea] = useState(
    draftArea || initialArea ||
    (data.find((location) => location.area === "Santarém")?.area ?? data[0]?.area ?? ""),
  );
  const area = draftArea ?? chosenArea;
  const [municipality, setMunicipality] = useState("");
  const [districtOpen, setDistrictOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [timeError, setTimeError] = useState(false);
  const [isCreatingPitch, setIsCreatingPitch] = useState(false);
  const { data: session, isPending, error: sessionError } = authClient.useSession();
  const { pitches, loading, error, retry } = useListPitchesForArea(area, Boolean(area));
  const { register, getValues } = useForm({
    defaultValues: { day: draft?.day ?? shiftAgendaDay(today, 1), time: draft?.time ?? "18:00" },
  });
  const { ref: dateRef, ...dateInput } = register("day");
  const { ref: timeRef, ...timeInput } = register("time");
  const selectedPitch = pitches.find((pitch) => String(pitch.id) === draft?.pitchId);
  const results = pitches.filter((pitch) =>
    (!municipality || pitch.municipality === municipality) && matchesPitchSearch(pitch, query));

  function closeConfirmation() {
    updateHomeSearch({ schedulePitch: null, scheduleDay: null, scheduleTime: null, scheduleArea: null }, true);
  }

  function changeArea(value: string) {
    setArea(value);
    setMunicipality("");
    closeConfirmation();
  }

  function selectPitch(pitchId: string) {
    const { day, time } = getValues();
    const startsAt = parseLisbonSlot(day, time);
    if (!startsAt || startsAt.valueOf() <= Date.now()) {
      setTimeError(true);
      return;
    }
    setTimeError(false);
    updateHomeSearch({ view: "schedule", scheduleArea: area, schedulePitch: pitchId, scheduleDay: day, scheduleTime: time });
  }

  return (
    <Stack spacing={2.5}>
      <Typography component="h1" sx={{ fontSize: { xs: "2.1rem", md: "3.1rem" }, lineHeight: 1, fontWeight: 900, letterSpacing: "-.055em", textTransform: "uppercase" }}>
        {agenda("schedule")}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1.4fr)" }, gap: 2 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Typography component="h2" sx={{ fontWeight: 800 }}>{t("when")}</Typography>
            <Stack direction="row" spacing={1} sx={{ "& > *": { minWidth: 0 } }}>
              <TextField {...dateInput} inputRef={dateRef} label={t("day")} type="date" size="small" fullWidth
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today } }} />
              <TextField {...timeInput} inputRef={timeRef} label={t("time")} type="time" size="small" fullWidth
                slotProps={{ inputLabel: { shrink: true } }} />
            </Stack>
            {timeError && <Alert severity="error">{t("invalid_time")}</Alert>}
          </Stack>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Typography component="h2" sx={{ fontWeight: 800 }}>{t("where")}</Typography>
            <AreaSelector data={data} area={area} municipality={municipality} districtOpen={districtOpen}
              setDistrictOpen={setDistrictOpen} onAreaChange={changeArea} onMunicipalityChange={setMunicipality}
              requireArea />
            <TextField label={t("search_pitch")} type="search" size="small" value={query}
              onChange={(event) => setQuery(event.target.value)} />
          </Stack>
        </Paper>
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>{t("pitches")}</Typography>
          <Typography variant="body2" color="text.secondary" aria-live="polite">
            {!loading && !error && t("pitch_count", { count: results.length })}
          </Typography>
        </Stack>
        {loading && <CircularProgress size={24} aria-label={t("loading")} />}
        {error && <Alert severity="error" action={<Button onClick={retry}>{agenda("retry")}</Button>}>{error}</Alert>}
        {!loading && !error && !results.length && <Typography color="text.secondary">{t("no_pitches")}</Typography>}
        {!loading && !error && results.map((pitch) => (
          <ButtonBase key={pitch.id} onClick={() => selectPitch(String(pitch.id))}
            aria-label={t("select_pitch", { name: pitch.name })}
            sx={{
              display: "grid", gridTemplateColumns: "48px minmax(0, 1fr) auto", gap: 1.5,
              p: 1.5, textAlign: "left", bgcolor: "background.paper", border: 1, borderColor: "divider",
              borderRadius: 2, "&:hover, &.Mui-focusVisible": { borderColor: "primary.main" },
            }}>
            <MatchPitchPhoto src={pitch.image_url} compact />
            <Stack sx={{ overflowWrap: "anywhere" }}>
              <Typography sx={{ fontWeight: 750 }}>{pitch.name}</Typography>
              <Typography variant="body2" color="text.secondary">{pitch.municipality}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.6} sx={{ alignItems: "center", color: "primary.main" }}>
              <Typography variant="body2" sx={{ fontWeight: 750, display: { xs: "none", sm: "block" } }}>{t("select")}</Typography>
              <ArrowForward fontSize="small" aria-hidden="true" />
            </Stack>
          </ButtonBase>
        ))}
        {!loading && !error && area && !pitches.length && (
          <CreatePitchButton selectedArea={area} isCreatingPitch={isCreatingPitch} setIsCreatingPitch={setIsCreatingPitch} />
        )}
      </Stack>
      {draft && !loading && !error && !selectedPitch && (
        <Alert severity="warning" onClose={closeConfirmation}>{t("pitch_unavailable")}</Alert>
      )}
      {draft && sessionError && <Alert severity="error">{t("session_error")}</Alert>}
      {draft && isPending && <CircularProgress size={24} aria-label={t("loading")} />}
      {draft && !isPending && !sessionError && selectedPitch && (
        <CreateMatchModal key={`${draft.pitchId}-${draft.startsAt}`} open setOpen={closeConfirmation} selectedArea={area}
          slot={{ pitchId: draft.pitchId, startsAt: draft.startsAt, name: selectedPitch.name, municipality: selectedPitch.municipality }}
          authReturnTo={session ? undefined : `/?${search.toString()}`}
          onCreated={(matchId) => router.replace(AppRoutes.MATCH_DETAILS(matchId))} />
      )}
    </Stack>
  );
}
