import auth from "@/app/lib/auth";
import { listProfileMatches, type ProfileMatchView } from "@/app/services/profile-matches";
import { authUrl } from "@/app/utils/auth-return";
import { AppRoutes } from "@/app/utils/routes";
import { Box, Button, Chip, Container, Link, Paper, Stack, Typography } from "@mui/material";
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Button href={AppRoutes.PROFILE} sx={{ alignSelf: "flex-start" }}>
          {t("back")}
        </Button>
        <Typography component="h1" variant="h4">{t("title")}</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            href={AppRoutes.ORGANIZED_MATCHES}
            variant={isOrganizerView ? "contained" : "outlined"}
            aria-current={isOrganizerView ? "page" : undefined}
          >
            {t("organized")}
          </Button>
          <Button
            href={AppRoutes.JOINED_MATCHES}
            variant={isOrganizerView ? "outlined" : "contained"}
            aria-current={isOrganizerView ? undefined : "page"}
          >
            {t("joined")}
          </Button>
        </Stack>
        {matches.length === 0 && (
          <Typography color="text.secondary">{t(isOrganizerView ? "empty_organized" : "empty_joined")}</Typography>
        )}
        <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
          {matches.map((match) => (
              <Box component="li" key={match.id}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={0.75} sx={{ alignItems: "flex-start" }}>
                    <Link href={AppRoutes.MATCH_DETAILS(match.id)} sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                      {match.pitch_name}
                    </Link>
                    <Typography color="text.secondary">{dateFormatter.format(match.starts_at)}</Typography>
                    <Chip
                      label={t(match.status)}
                      size="small"
                      color={match.status === "played" ? "success" : "default"}
                    />
                  </Stack>
                </Paper>
              </Box>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
