export function formatMatchDate(startsAt: Date, locale: string, includeYear = false) {
  const date = new Date(startsAt);
  const timeZone = "Europe/Lisbon";
  return {
    day: new Intl.DateTimeFormat(locale, {
      weekday: "long", day: "2-digit", month: "long", timeZone,
      ...(includeYear ? { year: "2-digit" } : {}),
    }).format(date),
    time: new Intl.DateTimeFormat(locale, {
      hour12: false, hour: "2-digit", minute: "2-digit", timeZone,
    }).format(date),
  };
}
