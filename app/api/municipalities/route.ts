import { listMunicipalitiesForArea } from "@/app/services/locations";
import { apiError } from "@/app/utils/api-error";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const area = url.searchParams.get("area");

  if (!area) {
    return apiError("AREA_REQUIRED", 400);
  }

  try {
    const municipalities = await listMunicipalitiesForArea(area);
    return Response.json(municipalities);
  } catch (error) {
    console.error("Falha ao carregar municípios", error);
    return apiError("LOCATION_READ_FAILED", 500);
  }
}
