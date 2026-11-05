import auth from "@/app/lib/auth";
import { getProfile } from "@/app/services/profile";
import { ErrorCode } from "@/app/utils/error";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: ErrorCode.SESSION_NOT_FOUND,
      },
      {
        status: 401,
      },
    );
  }

  const data = await getProfile(session.user.id);

  return Response.json(data);
}
