import type { FullMatch } from "@/app/models/match";
import type { CreateMatchFormValues } from "@/app/schemas/match";

type MatchFormSource = Pick<FullMatch, "description" | "pitch" | "duration_in_minutes" | "format" | "min_attendance">;

export function getMatchFormDefaults({
  existingMatch,
  template,
  selectedPitch,
}: {
  existingMatch?: MatchFormSource & Pick<FullMatch, "starts_at">;
  template?: MatchFormSource;
  selectedPitch?: string;
}): CreateMatchFormValues {
  const source = existingMatch ?? template;
  return {
    description: source?.description ?? "",
    pitchId: selectedPitch || source?.pitch.id?.toString() || "",
    durationInMinutes: Number(source?.duration_in_minutes ?? 60),
    startsAt: existingMatch ? new Date(existingMatch.starts_at).toISOString() : "",
    format: source?.format ?? "5x5",
    minAttendance: source?.min_attendance ?? 10,
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
