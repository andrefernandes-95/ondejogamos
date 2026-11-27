import type { FullMatch } from "@/app/models/match";
import type { CreateMatchFormValues } from "@/app/schemas/match";
import { minimumPlayersByFormat } from "./home-schedule";

type MatchFormSource = Pick<FullMatch, "description" | "pitch" | "duration_in_minutes" | "format" | "min_attendance">;

export function getMatchFormDefaults({
  existingMatch,
  template,
  selectedPitch,
  selectedStart,
  selectedOptions,
}: {
  existingMatch?: MatchFormSource & Pick<FullMatch, "starts_at">;
  template?: MatchFormSource;
  selectedPitch?: string;
  selectedStart?: string;
  selectedOptions?: { format: CreateMatchFormValues["format"]; duration: number };
}): CreateMatchFormValues {
  const source = existingMatch ?? template;
  return {
    description: source?.description ?? "",
    pitchId: selectedPitch || source?.pitch.id?.toString() || "",
    durationInMinutes: Number(source?.duration_in_minutes ?? selectedOptions?.duration ?? 60),
    startsAt: existingMatch ? new Date(existingMatch.starts_at).toISOString() : selectedStart ?? "",
    format: source?.format ?? selectedOptions?.format ?? "5x5",
    minAttendance: source?.min_attendance ?? minimumPlayersByFormat[selectedOptions?.format ?? "5x5"],
  };
}

export function toMatchFormData(values: CreateMatchFormValues, matchId?: string) {
  const formData = new FormData();

  if (matchId) {
    formData.append("id", matchId);
  }
  formData.append("pitchId", values.pitchId);
  formData.append("description", values.description ?? "");
  formData.append("durationInMinutes", String(values.durationInMinutes ?? 60));
  formData.append("format", values.format);
  formData.append("minAttendance", String(values.minAttendance));
  formData.append("startsAt", values.startsAt);

  return formData;
}
