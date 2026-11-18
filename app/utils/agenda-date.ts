const lisbonDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit",
});

export function agendaDay(value: Date | string) {
  const parts = lisbonDay.formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function validAgendaDay(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const day = new Date(value);
  return Number.isFinite(day.getTime()) && day.toISOString().slice(0, 10) === value;
}

export function shiftAgendaDay(day: string, days: number) {
  const date = new Date(day);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function agendaWeek(day: string) {
  const weekday = new Date(day).getUTCDay();
  const monday = shiftAgendaDay(day, -((weekday + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => shiftAgendaDay(monday, index));
}

export function formatAgendaDay(
  day: string, locale: string, options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(new Date(day));
}
