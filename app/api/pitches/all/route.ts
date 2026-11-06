import auth from "@/app/lib/auth";
import { listAllPitches } from "@/app/services/pitches";
import { apiError } from "@/app/utils/api-error";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  try {
    const pitches = await listAllPitches(session?.user.id ?? "");
    return Response.json(pitches);
  } catch (error) {
    console.error("Falha ao carregar campos", error);
    return apiError("PITCH_READ_FAILED", 500);
  }
}
