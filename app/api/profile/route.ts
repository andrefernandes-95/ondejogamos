import auth from "@/app/lib/auth";
import { listAreas } from "@/app/services/locations";
import { savePlayerProfile } from "@/app/services/player-profiles";
import { uploadPlayerAvatar, validatePlayerAvatar } from "@/app/services/player-avatar-storage";
import { apiError } from "@/app/utils/api-error";
import { playerProfileSchema } from "@/app/validations/player-profile";

function readProfileFields(formData: FormData): unknown {
  return {
    name: formData.get("name"),
    date_of_birth: formData.get("date_of_birth") || null,
    preferred_area: formData.get("preferred_area") || null,
    preferred_position: formData.get("preferred_position") || null,
  };
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return apiError("AUTHENTICATION_REQUIRED", 401);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return apiError("PLAYER_PROFILE_INVALID", 400);
  }

  const parsed = playerProfileSchema.safeParse(readProfileFields(formData));
  const avatarField = formData.get("avatar");
  if (!parsed.success || (avatarField !== null && !(avatarField instanceof File))) {
    return apiError("PLAYER_PROFILE_INVALID", 400);
  }
  const avatar = avatarField instanceof File ? avatarField : null;
  const extension = avatar ? validatePlayerAvatar(avatar) : null;
  if (avatar && !extension) {
    return apiError("PLAYER_PROFILE_INVALID", 400);
  }

  try {
    if (parsed.data.preferred_area !== null) {
      const areas = await listAreas();
      if (!areas.includes(parsed.data.preferred_area)) {
        return apiError("PLAYER_PROFILE_INVALID", 400);
      }
    }

    const uploadedAvatar = avatar && extension ? await uploadPlayerAvatar(avatar, extension) : null;
    const profile = await savePlayerProfile({
      userId: session.user.id,
      ...parsed.data,
      avatar: uploadedAvatar,
    });
    return Response.json(profile.editingProfile);
  } catch (error) {
    console.error("Could not update player profile", error);
    return apiError("PLAYER_PROFILE_UPDATE_FAILED", 500);
  }
}
