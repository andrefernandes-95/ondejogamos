import { missingCardMedia, portraitResponse } from "@/app/services/card-media";
import { findPublicCard } from "@/app/services/player-cards";

export async function GET(_request: Request, { params }: { params: Promise<{ publicId: string }> }) {
  const row = await findPublicCard((await params).publicId);
  if (!row?.visible_fields?.includes("photo") || !row.avatar_storage_key) return missingCardMedia();
  return portraitResponse(row.avatar_storage_key);
}
