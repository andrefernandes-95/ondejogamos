import auth from "@/app/lib/auth";
import { profilePreferencesSchema } from "@/app/schemas/profile";
import { listAreas } from "@/app/services/locations";
import { getProfile, saveProfile } from "@/app/services/profile";
import { apiError } from "@/app/utils/api-error";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return apiError("AUTHENTICATION_REQUIRED", 401);

    return Response.json(await getProfile(session.user.id));
  } catch (error) {
    console.error("Failed to load profile", error);
    return apiError("PROFILE_READ_FAILED", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return apiError("AUTHENTICATION_REQUIRED", 401);

    const parsed = profilePreferencesSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return apiError("INVALID_FORM", 400);

    const area = parsed.data.preferred_area;
    if (area && !(await listAreas()).includes(area)) {
      const current = await getProfile(session.user.id);
      if (area !== current?.preferred_area) return apiError("INVALID_FORM", 400);
    }

    await saveProfile(session.user.id, parsed.data);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to save profile", error);
    return apiError("PROFILE_UPDATE_FAILED", 500);
  }
}