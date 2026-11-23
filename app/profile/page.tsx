import OwnerCard from "@/app/components/player-profile/owner-card";
import auth from "@/app/lib/auth";
import { listAreas } from "@/app/services/locations";
import { cardData, findOwnerCard } from "@/app/services/player-cards";
import { AppRoutes } from "@/app/utils/routes";
import { Button, Container } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(AppRoutes.LOGIN);

  const [areas, row, t] = await Promise.all([
    listAreas(),
    findOwnerCard(session.user.id),
    getTranslations("App.OrganizedMatches"),
  ]);
  if (!row) redirect(AppRoutes.LOGIN);
  const portrait = row.avatar_storage_key ? "/api/player-card/portrait" : null;
  const data = await cardData(row, portrait);

  return (
    <Container component="main" maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
      <OwnerCard initial={{ ...data, areas }} />
      <Button href={AppRoutes.ORGANIZED_MATCHES} sx={{ display: "flex", mx: "auto", mt: 2 }}>
        {t("link")}
      </Button>
    </Container>
  );
}
