import { getTranslations } from "next-intl/server";
import { listMunicipalitiesForArea } from "@/app/services/locations";

export async function GET(request: Request) {
  const t = await getTranslations();
  const url = new URL(request.url);
  const area = url.searchParams.get("area");

  if (!area) {
    return Response.json({ error: t("Api.areaRequired") }, { status: 400 });
  }

  const municipalities = await listMunicipalitiesForArea(area);
  return Response.json(municipalities);
}
