import { listMunicipalitiesForArea } from "@/app/services/locations";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const area = url.searchParams.get("area");

  if (!area) {
    return Response.json({ error: "A área é obrigatória" }, { status: 400 });
  }

  const municipalities = await listMunicipalitiesForArea(area);
  return Response.json(municipalities);
}
