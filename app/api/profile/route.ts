import auth from "@/app/lib/auth";
import { listAreas } from "@/app/services/locations";
import { savePlayerProfile } from "@/app/services/player-profiles";
import { apiError } from "@/app/utils/api-error";
import { playerProfileSchema } from "@/app/validations/player-profile";

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return apiError("AUTHENTICATION_REQUIRED", 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiError("PLAYER_PROFILE_INVALID", 400);
  }

  const parsed = playerProfileSchema.safeParse(payload);
  if (!parsed.success) {
    return apiError("PLAYER_PROFILE_INVALID", 400);
  }

  try {
    const input = parsed.data;
    if (input.preferred_area !== null) {
      const areas = await listAreas();
      if (!areas.includes(input.preferred_area)) {
        return apiError("PLAYER_PROFILE_INVALID", 400);
      }
    }

    const profile = await savePlayerProfile({
      userId: session.user.id,
      ...parsed.data,
    });
    return Response.json(profile.editingProfile);
  } catch (error) {
    console.error("Could not update player profile", error);
    return apiError("PLAYER_PROFILE_UPDATE_FAILED", 500);
  }
}
