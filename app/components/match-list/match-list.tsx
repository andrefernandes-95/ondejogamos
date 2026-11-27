import MatchCard from "@/app/components/match-card/match-card";
import { useListMatchesForArea } from "@/app/hooks/matches";
import { agendaDay, agendaWeek, formatAgendaDay, shiftAgendaDay, validAgendaDay } from "@/app/utils/agenda-date";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import WeekCalendar from "./week-calendar";

interface Props {
  area: string;
  municipality: string;
  today: string;
  requestedDay: string | null;
  onDayChange: (day: string) => void;
  onClearLocation: () => void;
}

export default function MatchList({
  area, municipality, today, requestedDay, onDayChange, onClearLocation,
}: Props) {
  const { matches, refresh, error, loading } = useListMatchesForArea(area);
  const t = useTranslations("App.Agenda");
  const locale = useLocale();
  const localMatches = matches
    .filter((match) => !municipality || match.pitch.municipality === municipality)
    .map((match) => ({ match, day: agendaDay(match.starts_at) }));
  const matchDays = new Set(localMatches.map((entry) => entry.day));
  const firstDay = localMatches[0]?.day ?? today;
  const day = validAgendaDay(requestedDay) && requestedDay >= today ? requestedDay : firstDay;
  const dailyMatches = localMatches.filter((entry) => entry.day === day);
  const nextDay = localMatches.find((entry) => entry.day > day)?.day ?? firstDay;

  function changeWeek(direction: -1 | 1) {
    const monday = shiftAgendaDay(agendaWeek(day)[0], 7 * direction);
    const weekStart = monday >= today ? monday : today;
    const nextMatchDay = agendaWeek(monday).find((date) => date >= today && matchDays.has(date));
    onDayChange(nextMatchDay ?? weekStart);
  }

  return (
    <Stack spacing={{ xs: 2.5, md: 3 }}>
      <WeekCalendar day={day} today={today} matchDays={matchDays}
        onDayChange={onDayChange} onWeekChange={changeWeek} />
      <Box component="section" aria-labelledby="agenda-results-heading" aria-busy={loading}>
        <Typography id="agenda-results-heading" component="h2" aria-live="polite"
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.625rem", md: "2rem" }, fontWeight: 750,
            "&::first-letter": { textTransform: "uppercase" },
          }}>
          {formatAgendaDay(day, locale, { weekday: "long", day: "numeric", month: "long" })}
        </Typography>
        {loading ? (
          <Stack direction="row" spacing={1.5} sx={{ py: 4, alignItems: "center" }} role="status">
            <CircularProgress size={24} aria-label={t("loading")} />
            <Typography>{t("loading")}</Typography>
          </Stack>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}
            action={<Button color="inherit" onClick={refresh}>{t("retry")}</Button>}>
            {error}
          </Alert>
        ) : dailyMatches.length ? (
          <Stack component="ul" spacing={{ xs: 1.25, sm: 1.5 }} sx={{ listStyle: "none", p: 0, m: 0, mt: 1 }}>
            {dailyMatches.map(({ match }) => (
              <MatchCard match={match} key={match.id} onAttendanceChanged={refresh} />
            ))}
          </Stack>
        ) : (
          <Stack spacing={1} sx={{ py: 2, alignItems: "flex-start" }} aria-live="polite">
            <Typography color="text.secondary">{t("empty_day")}</Typography>
            {localMatches.length > 0 && (
              <Button onClick={() => onDayChange(nextDay)}>{t("show_upcoming_date")}</Button>
            )}
            {(area || municipality) && (
              <Button onClick={onClearLocation}>{t("show_all_areas")}</Button>
            )}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
