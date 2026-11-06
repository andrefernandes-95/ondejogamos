import { CreateMatchFormValues } from "@/app/schemas/match";

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
