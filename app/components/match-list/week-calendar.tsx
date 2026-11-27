import { agendaWeek, formatAgendaDay } from "@/app/utils/agenda-date";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  day: string;
  today: string;
  matchDays: ReadonlySet<string>;
  onDayChange: (day: string) => void;
  onWeekChange: (direction: -1 | 1) => void;
}

export default function WeekCalendar({ day, today, matchDays, onDayChange, onWeekChange }: Props) {
  const t = useTranslations("App.Agenda");
  const locale = useLocale();
  const week = agendaWeek(day);
  const month = formatAgendaDay(day, locale, { month: "long", year: "numeric" });

  return (
    <Box sx={{
      display: "grid",
      gridTemplateAreas: { xs: '"month previous next" "days days days"', md: '"month previous days next"' },
      gridTemplateColumns: { xs: "minmax(0, 1fr) 40px 40px", md: "auto 44px minmax(0, 1fr) 44px" },
      alignItems: "center", border: 1, borderColor: "divider", borderRadius: 2,
      p: { xs: 0.5, md: 1 }, gap: { xs: 0, md: 1 },
    }}>
      <Typography sx={{
        gridArea: "month", px: { xs: 0.5, sm: 1 }, fontWeight: 750,
        fontSize: { xs: "0.875rem", sm: "1rem" }, "&::first-letter": { textTransform: "uppercase" },
      }}>
        {month}
      </Typography>
      <IconButton sx={{ gridArea: "previous", p: 0, minHeight: 44 }}
        aria-label={t("previous_week")} disabled={week[0] <= today}
        onClick={() => onWeekChange(-1)}>
        <ChevronLeft />
      </IconButton>
      <Box role="group" aria-label={t("days")} sx={{
        gridArea: "days", display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "2px",
      }}>
        {week.map((date) => {
          const selected = day === date;
          const fullDate = formatAgendaDay(date, locale, { dateStyle: "full" });
          const hasMatches = matchDays.has(date);
          return (
            <Button key={date} aria-pressed={selected} aria-current={date === today ? "date" : undefined}
              aria-label={hasMatches ? t("day_with_matches", { date: fullDate }) : fullDate}
              variant={selected ? "contained" : "text"} color={selected ? "primary" : "inherit"}
              disabled={date < today} onClick={() => onDayChange(date)}
              sx={{ minWidth: 0, px: 0, py: 0.75, minHeight: 54, borderRadius: 2 }}>
              <Stack sx={{ alignItems: "center", minWidth: 0 }}>
                <Typography component="span" variant="caption" sx={{ textTransform: "capitalize", fontSize: { xs: "0.66rem", sm: "0.75rem" } }}>
                  {formatAgendaDay(date, locale, { weekday: "short" }).slice(0, 3)}
                </Typography>
                <Typography component="span" sx={{ fontWeight: 750, fontSize: { xs: "1rem", sm: "1.25rem" }, lineHeight: 1.2 }}>
                  {formatAgendaDay(date, locale, { day: "numeric" })}
                </Typography>
                <Box aria-hidden="true" sx={{
                  width: 4, height: 4, borderRadius: "50%", mt: 0.25,
                  bgcolor: hasMatches ? (selected ? "common.white" : "primary.main") : "transparent",
                }} />
              </Stack>
            </Button>
          );
        })}
      </Box>
      <IconButton sx={{ gridArea: "next", p: 0, minHeight: 44 }}
        aria-label={t("next_week")} onClick={() => onWeekChange(1)}>
        <ChevronRight />
      </IconButton>
    </Box>
  );
}
