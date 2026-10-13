import { getTranslations } from "next-intl/server";
import { getPitchMatchesForDateInterval } from "@/app/services/matches";

export async function GET(request: Request) {
  const t = await getTranslations();
  const { searchParams } = new URL(request.url);

  const pitch_id = searchParams.get("pitch_id");
  const from = searchParams.get("from");
  const until = searchParams.get("until");

  if (!pitch_id || !from || !until) {
    return Response.json(
      {
        error: t("Api.invalidParameters"),
      },
      {
        status: 400,
      },
    );
  }

  try {
    const matches = await getPitchMatchesForDateInterval(pitch_id, from, until);
    return Response.json(matches, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Falha ao consultar disponibilidade: ", error);
    return Response.json(
      {
        error: t("Api.availabilityError"),
      },
      {
        status: 500,
      },
    );
  }
}
