import PageContainer from "@/app/components/page-container/page-container";
import PageTitle from "@/app/components/page-title/page-title";
import PlayerIdentity from "@/app/components/player-identity/player-identity";
import type { Player } from "@/app/services/user";
import { Box, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

export default function PlayerList({ data }: { data: Player[] }) {
  const t = useTranslations("App.PlayerList");
  const locale = useLocale();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "Europe/Lisbon" });

  return (
    <PageContainer maxWidth="md">
      <Stack spacing={2}>
        <PageTitle title={t("player_list")} />
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {data.map((player) => (
            <Stack key={player.id} component="li" direction={{ xs: "column", sm: "row" }}
              sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, gap: 1.5, py: 2, borderTop: 1, borderColor: "divider" }}>
              <PlayerIdentity player={player.identity} size={56} />
              <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
                <Typography variant="body2" color="text.secondary">{t("joined_at")} · {date.format(new Date(player.createdAt))}</Typography>
                <Typography variant="body2" color="text.secondary">{t("games_scheduled")} · {player.games_created}</Typography>
              </Stack>
            </Stack>
          ))}
        </Box>
      </Stack>
    </PageContainer>
  );
}
