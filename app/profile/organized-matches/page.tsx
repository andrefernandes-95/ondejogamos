import auth from "@/app/lib/auth";
import { listOrganizedMatches } from "@/app/services/organized-matches";
import { authUrl } from "@/app/utils/auth-return";
import { formatMatchDate } from "@/app/utils/match-date";
import { AppRoutes } from "@/app/utils/routes";
import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { getLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrganizedMatchesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(authUrl(AppRoutes.LOGIN, AppRoutes.ORGANIZED_MATCHES));
  }

  const [matches, t, locale] = await Promise.all([
    listOrganizedMatches(session.user.id),
    getTranslations("App.OrganizedMatches"),
    getLocale(),
  ]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Button href={AppRoutes.PROFILE} sx={{ alignSelf: "flex-start" }}>
          {t("back")}
        </Button>
        <Typography component="h1" variant="h4">{t("title")}</Typography>
        {matches.length === 0 && (
          <Typography color="text.secondary">{t("empty")}</Typography>
        )}
        <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
          {matches.map((match) => {
            const { day, time } = formatMatchDate(match.starts_at, locale, true);
            return (
              <Box component="li" key={match.id}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
                    <Link href={AppRoutes.MATCH_DETAILS(match.id)}>{match.pitch_name}</Link>
                    <Typography color="text.secondary">{t("date", { day, time })}</Typography>
                    <Chip label={t(match.status)} size="small" />
                  </Stack>
                </Paper>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
}
