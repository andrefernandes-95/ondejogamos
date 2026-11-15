import { missingCardMedia, playerCardPng } from "@/app/services/card-media";
import { cardData, findPublicCard } from "@/app/services/player-cards";
import { visibleCard } from "@/app/utils/player-card";

export async function GET(_request: Request, { params }: { params: Promise<{ publicId: string }> }) {
  const row = await findPublicCard((await params).publicId);
  if (!row) return missingCardMedia();

  const portrait = row.avatar_storage_key ? "saved-portrait" : null;
  return playerCardPng(visibleCard(await cardData(row, portrait)), row.avatar_storage_key, false);
}
