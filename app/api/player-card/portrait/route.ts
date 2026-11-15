import auth from "@/app/lib/auth";
import { missingCardMedia, portraitResponse } from "@/app/services/card-media";
import { findOwnerCard } from "@/app/services/player-cards";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return missingCardMedia();
  const row = await findOwnerCard(session.user.id);
  if (!row?.avatar_storage_key) return missingCardMedia();
  return portraitResponse(row.avatar_storage_key);
}
