import { suggestPitches } from "@/app/services/pitches";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const area = url.searchParams.get("area");
  const limit = url.searchParams.get("limit");

  const pitches = await suggestPitches(area ?? "", Number(limit) ?? 5);
  return Response.json(pitches);
}
