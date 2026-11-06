import { suggestPitches } from "@/app/services/pitches";
import { apiError } from "@/app/utils/api-error";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const area = url.searchParams.get("area");
  const limit = url.searchParams.get("limit");

  const parsedLimit = Number(limit ?? 5);
  if (!Number.isFinite(parsedLimit) || parsedLimit < 1) {
    return apiError("INVALID_QUERY", 400);
  }

  try {
    const pitches = await suggestPitches(area ?? "", parsedLimit);
    return Response.json(pitches);
  } catch (error) {
    console.error("Falha ao sugerir campos", error);
    return apiError("PITCH_READ_FAILED", 500);
  }
}
