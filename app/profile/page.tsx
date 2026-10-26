import PlayerProfile from "@/app/components/player-profile/player-profile";
import auth from "@/app/lib/auth";
import { AppRoutes } from "@/app/utils/routes";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(AppRoutes.LOGIN);
  }

  return <PlayerProfile name={session.user.name} image={session.user.image} />;
}
