import auth from "@/app/lib/auth";
import { listAllPitches } from "@/app/services/pitches";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const pitches = await listAllPitches(session?.user.id ?? "");
  return Response.json(pitches);
}
