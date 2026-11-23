import { getFullMatchById } from "@/app/services/matches";
import { apiError } from "@/app/utils/api-error";
import { parseAttendanceMatchId } from "@/app/utils/attendance-match-id";
import { matchCalendar } from "@/app/utils/match-calendar";
import { getTranslations } from "next-intl/server";

export async function GET(_request: Request, { params }: RouteContext<"/match/[id]/calendar">) {
  const { id } = await params;
  const matchId = parseAttendanceMatchId(id);
  if (matchId === null) {
    return apiError("MATCH_NOT_FOUND", 404);
  }

  try {
    const match = await getFullMatchById(matchId);
    if (!match?.accepts_attendance) {
      return apiError("MATCH_NOT_FOUND", 404);
    }
    const t = await getTranslations("App.MatchDetailsPage");
    return new Response(matchCalendar(match, t("calendar_title", { format: match.format })), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="ondejogamos-' + matchId + '.ics"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Falha ao exportar calendário do jogo", error);
    return apiError("MATCH_READ_FAILED", 500);
  }
}
