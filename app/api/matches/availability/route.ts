import { getPitchMatchesForDateInterval } from "@/app/services/matches";
import { apiError } from "@/app/utils/api-error";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const pitch_id = searchParams.get("pitch_id");
  const from = searchParams.get("from");
  const until = searchParams.get("until");

  if (!pitch_id || !from || !until) {
    return apiError("INVALID_QUERY", 400);
  }

  try {
    const matches = await getPitchMatchesForDateInterval(pitch_id, from, until);
    return Response.json(matches, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Falha ao consultar disponibilidade: ", error);
    return apiError("AVAILABILITY_READ_FAILED", 500);
  }
}
