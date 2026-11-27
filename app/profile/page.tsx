import OwnerCard from "@/app/components/player-profile/owner-card";
import PageContainer from "@/app/components/page-container/page-container";
import PageTitle from "@/app/components/page-title/page-title";
import auth from "@/app/lib/auth";
import { listAreas } from "@/app/services/locations";
import { cardData, findOwnerCard } from "@/app/services/player-cards";
import { AppRoutes } from "@/app/utils/routes";
import { Button, Stack } from "@mui/material";
import { EventAvailable } from "@mui/icons-material";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(AppRoutes.LOGIN);

  const [areas, row, t, card] = await Promise.all([
    listAreas(),
    findOwnerCard(session.user.id),
    getTranslations("App.ProfileMatches"),
    getTranslations("App.PlayerCard"),
  ]);
  if (!row) redirect(AppRoutes.LOGIN);
  const portrait = row.avatar_storage_key ? "/api/player-card/portrait" : null;
  const data = await cardData(row, portrait);

  return (
    <PageContainer maxWidth="md">
      <Stack spacing={3}>
        <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <PageTitle title={card("title")} />
          <Button href={AppRoutes.JOINED_MATCHES} variant="outlined" startIcon={<EventAvailable />}>{t("title")}</Button>
        </Stack>
        <OwnerCard initial={{ ...data, areas }} />
      </Stack>
    </PageContainer>
  );
}
