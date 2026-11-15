import auth from "@/app/lib/auth";
import { PortraitStorageUnavailable, storePortrait } from "@/app/lib/portrait-storage";
import { listAreas } from "@/app/services/locations";
import { findOwnerCard } from "@/app/services/player-cards";
import { drainPortraitCleanup, queuePortraitCleanup } from "@/app/services/portrait-cleanup";
import { savePlayerCard } from "@/app/services/save-player-card";
import { apiError } from "@/app/utils/api-error";
import { readCardRequest } from "@/app/utils/card-request";
import { normalizePortrait } from "@/app/utils/portrait-image";
import { randomUUID } from "node:crypto";

export async function PUT(request: Request) {
  let uploadedKey: string | null = null;
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return apiError("AUTHENTICATION_REQUIRED", 401);

    const input = await readCardRequest(request);
    if (!input) return apiError("INVALID_FORM", 400);
    const { settings, photo } = input;
    const current = await findOwnerCard(session.user.id);
    if (!current) return apiError("AUTHENTICATION_REQUIRED", 401);
    if (settings.badges.includes("founder") && !current.is_founder) {
      return apiError("FORBIDDEN", 403);
    }
    if (settings.area && settings.area !== current.preferred_area &&
      !(await listAreas()).includes(settings.area)) {
      return apiError("INVALID_FORM", 400);
    }

    if (photo) {
      const bytes = await normalizePortrait(photo);
      if (!bytes) return apiError("INVALID_PLAYER_PORTRAIT", 400);
      uploadedKey = `player-portraits/${randomUUID()}.webp`;
      await storePortrait(uploadedKey, bytes);
    }

    const publicId = await savePlayerCard(session.user.id, settings, uploadedKey);
    await drainPortraitCleanup().catch(console.error);
    return Response.json({ publicId });
  } catch (error) {
    if (error instanceof PortraitStorageUnavailable) return apiError("STORAGE_NOT_CONFIGURED", 503);
    if (uploadedKey) {
      await queuePortraitCleanup(uploadedKey).catch(console.error);
    }
    console.error("Failed to save player card", error);
    return apiError("PROFILE_UPDATE_FAILED", 500);
  }
}
