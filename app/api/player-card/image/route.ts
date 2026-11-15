import auth from "@/app/lib/auth";
import { missingCardMedia, playerCardPng } from "@/app/services/card-media";
import { cardData, findOwnerCard } from "@/app/services/player-cards";
import { visibleCard } from "@/app/utils/player-card";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return missingCardMedia();
  const row = await findOwnerCard(session.user.id);
  if (!row) return missingCardMedia();

  const portrait = row.avatar_storage_key ? "/api/player-card/portrait" : null;
  return playerCardPng(visibleCard(await cardData(row, portrait)), row.avatar_storage_key, true);
}
