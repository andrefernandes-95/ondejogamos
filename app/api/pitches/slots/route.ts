import { listPitchesWithSlots } from "@/app/services/pitch-availability";
import { agendaDay, shiftAgendaDay, validAgendaDay } from "@/app/utils/agenda-date";
import { apiError } from "@/app/utils/api-error";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area");
  const day = searchParams.get("day");
  const duration = Number(searchParams.get("duration"));
  if (!area || !validAgendaDay(day) || !validAgendaDay(shiftAgendaDay(day, 1)) || day < agendaDay(new Date()) ||
    !Number.isInteger(duration) || duration < 30 || duration > 1440) {
    return apiError("INVALID_QUERY", 400);
  }

  try {
    return Response.json(await listPitchesWithSlots(area, day, duration), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Falha ao consultar horários dos campos", error);
    return apiError("AVAILABILITY_READ_FAILED", 500);
  }
}
