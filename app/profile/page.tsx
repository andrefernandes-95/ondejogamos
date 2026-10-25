import PlayerProfile from "@/app/components/player-profile/player-profile";
import auth from "@/app/lib/auth";
import { listAreas } from "@/app/services/locations";
import { getCurrentPlayerProfile } from "@/app/services/player-profiles";
import { AppRoutes } from "@/app/utils/routes";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(AppRoutes.LOGIN);
  }

  const [{ editingProfile }, areas] = await Promise.all([
    getCurrentPlayerProfile(session.user),
    listAreas(),
  ]);
  return (
    <PlayerProfile
      editingProfile={editingProfile}
      areas={areas}
    />
  );
}
