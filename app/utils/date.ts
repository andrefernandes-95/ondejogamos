import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const DATE_ONLY_FORMAT = "YYYY-MM-DD";

export function parseDateOnly(value: string): Date | null {
  const date = dayjs.utc(value, DATE_ONLY_FORMAT, true);

  return date.isValid() ? date.toDate() : null;
}

export function toDateOnly(value: Date | string | null): string | null {
  if (!value) {
    return null;
  }

  const parsedValue = value instanceof Date ? value : parseDateOnly(value);
  if (!parsedValue) {
    return null;
  }

  const date = dayjs.utc(parsedValue);

  return date.isValid() ? date.format(DATE_ONLY_FORMAT) : null;
}

export function calculateAge(
  dateOfBirth: Date | string | null,
  onDate: Date = new Date(),
): number | null {
  const birthDate =
    dateOfBirth instanceof Date ? dateOfBirth : parseDateOnly(dateOfBirth ?? "");

  if (!birthDate) {
    return null;
  }

  const birthday = dayjs.utc(birthDate);
  const referenceDate = dayjs.utc(onDate);
  if (birthday.isAfter(referenceDate, "day")) {
    return null;
  }

  return referenceDate.diff(birthday, "year");
}
