import PlayerProfile from "@/app/components/player-profile/player-profile";
import { brandBlueLight } from "@/app/design/brand-colors";
import type { FullMatch } from "@/app/models/match";
import { getPublicCardsBySlug } from "@/app/services/player-cards";
import { playerCardPath } from "@/app/utils/player-card";
import { GroupsOutlined } from "@mui/icons-material";
import { Box, Card, Chip, Link, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

const cardSize = 124;

export default async function MatchPlayers({ match }: { match: FullMatch }) {
  const players = [
    { id: "organizer", player: match.creator },
    ...match.attendances.map(({ user_id, player }) => ({ id: user_id, player })),
  ];
  const slugs = players.flatMap(({ player }) => player.publicSlug ? [player.publicSlug] : []);
  const [cards, t, cardText] = await Promise.all([
    getPublicCardsBySlug(slugs),
    getTranslations("App.MatchDetailsPage"),
    getTranslations("App.PlayerCard"),
  ]);
  const labels = { founder: cardText("founder"), played: cardText("played"), created: cardText("created") };

  return (
    <Card component="section" aria-labelledby="match-roster" variant="outlined"
      sx={{ borderRadius: 6, p: { xs: 1.5, sm: 3 } }}>
      <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
        <GroupsOutlined color="primary" />
        <Typography id="match-roster" component="h2" variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
          {t("player_list")}
        </Typography>
        <Chip size="small" label={t("player_count", { count: players.length })} sx={{ bgcolor: brandBlueLight, color: "primary.dark" }} />
      </Stack>
      <Box component="ol" role="list" sx={{
        display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${cardSize}px), 1fr))`,
        gap: { xs: 1, sm: 2 }, listStyle: "none", m: 0, p: 0,
      }}>
        {players.map(({ id, player }, index) => {
          const card = cards.get(player.publicSlug);
          const preview = <PlayerProfile card={card ?? { name: player.name, badges: [] }} labels={labels} size={cardSize} />;

          return (
            <Stack key={id} component="li" sx={{ alignItems: "center", gap: 0.5, minWidth: 0 }}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 0.5, minHeight: 24 }}>
                <Typography component="span" variant="caption" sx={{
                  bgcolor: brandBlueLight, color: "primary.dark", px: 0.75, borderRadius: 1, fontWeight: 850,
                  fontVariantNumeric: "tabular-nums",
                }}>{String(index + 1).padStart(2, "0")}</Typography>
                {index === 0 && <Typography variant="caption" sx={{ fontWeight: 750 }}>{t("organizer_role")}</Typography>}
              </Stack>
              {card ? (
                <Link href={playerCardPath(player.publicSlug)} underline="none" sx={{
                  display: "block", maxWidth: "100%", borderRadius: 2,
                  "@media (prefers-reduced-motion: no-preference)": { transition: "transform 160ms ease", "&:hover": { transform: "translateY(-3px)" } },
                  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
                }}>{preview}</Link>
              ) : preview}
            </Stack>
          );
        })}
      </Box>
    </Card>
  );
}
