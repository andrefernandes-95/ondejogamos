import auth from "@/app/lib/auth";
import PageContainer from "@/app/components/page-container/page-container";
import PageTitle from "@/app/components/page-title/page-title";
import ViewNavigation from "@/app/components/view-navigation/view-navigation";
import { listProfileMatches, type ProfileMatchView } from "@/app/services/profile-matches";
import { authUrl } from "@/app/utils/auth-return";
import { AppRoutes } from "@/app/utils/routes";
import { Box, Chip, Link, Stack, Typography } from "@mui/material";
import { getLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfileMatches({ view }: { view: ProfileMatchView }) {
  const isOrganizerView = view === "organized";
  const path = isOrganizerView ? AppRoutes.ORGANIZED_MATCHES : AppRoutes.JOINED_MATCHES;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(authUrl(AppRoutes.LOGIN, path));
  }

  const [matches, t, locale] = await Promise.all([
    listProfileMatches(session.user.id, view),
    getTranslations("App.ProfileMatches"),
    getLocale(),
  ]);
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Lisbon",
  });

  return (
    <PageContainer maxWidth="md">
      <Stack spacing={2}>
        <PageTitle title={t("title")} back={{ href: AppRoutes.PROFILE, label: t("back") }} />
        <ViewNavigation label={t("title")} links={[
          { href: AppRoutes.ORGANIZED_MATCHES, label: t("organized"), active: isOrganizerView },
          { href: AppRoutes.JOINED_MATCHES, label: t("joined"), active: !isOrganizerView },
        ]} />
        {matches.length === 0 && (
          <Typography color="text.secondary">{t(isOrganizerView ? "empty_organized" : "empty_joined")}</Typography>
        )}
        <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
          {matches.map((match) => (
            <Box component="li" key={match.id} sx={{ py: 2, borderTop: 1, borderColor: "divider" }}>
              <Stack direction={{ xs: "column", sm: "row" }}
                sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 1.5 }}>
                <Box>
                  <Link href={AppRoutes.MATCH_DETAILS(match.id)} sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>
                    {match.pitch_name}
                  </Link>
                  <Typography variant="body2" color="text.secondary">{dateFormatter.format(match.starts_at)}</Typography>
                </Box>
                <Chip label={t(match.status)} size="small" color={match.status === "played" ? "success" : "default"} />
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </PageContainer>
  );
}
