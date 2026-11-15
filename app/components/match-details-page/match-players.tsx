import PlayerIdentity from "@/app/components/player-identity/player-identity";
import type { FullMatch } from "@/app/models/match";
import { Groups } from "@mui/icons-material";
import { Card, List, ListItem, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function MatchPlayers({ match }: { match: FullMatch }) {
  const t = useTranslations("App.MatchDetailsPage");
  return (
    <Card variant="outlined" sx={{ borderRadius: 6, p: { xs: 2, sm: 4 } }}>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <Groups />
        <Typography component="h2">{t("player_list")}</Typography>
      </Stack>
      <List disablePadding sx={{ mt: 1 }}>
        <ListItem disableGutters><PlayerIdentity player={match.creator} /></ListItem>
        {match.attendances.map((attendance) => (
          <ListItem disableGutters key={attendance.user_id}>
            <PlayerIdentity player={attendance.player} />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
