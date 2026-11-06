import auth from "@/app/lib/auth";
import { getProfile } from "@/app/services/profile";
import { apiError } from "@/app/utils/api-error";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return apiError("AUTHENTICATION_REQUIRED", 401);
  }

  try {
    const data = await getProfile(session.user.id);
    return Response.json(data);
  } catch (error) {
    console.error("Falha ao carregar perfil", error);
    return apiError("PROFILE_READ_FAILED", 500);
  }
}
