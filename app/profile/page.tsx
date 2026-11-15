import ProfileForm from "@/app/components/profile-form/profile-form";
import auth from "@/app/lib/auth";
import { listAreas } from "@/app/services/locations";
import { getProfile } from "@/app/services/profile";
import { AppRoutes } from "@/app/utils/routes";
import { Card, Container } from "@mui/material";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(AppRoutes.LOGIN);

  const [areas, profile] = await Promise.all([
    listAreas(),
    getProfile(session.user.id),
  ]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        <ProfileForm
          name={session.user.name}
          areas={areas}
          preferredArea={profile?.preferred_area ?? ""}
          preferredPosition={profile?.preferred_position ?? ""}
        />
      </Card>
    </Container>
  );
}
