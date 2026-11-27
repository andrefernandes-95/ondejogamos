import PlayerProfile from "@/app/components/player-profile/player-profile";
import type { PlayerIdentity as Player } from "@/app/models/player-identity";
import { playerCardPath } from "@/app/utils/player-card";
import { Box, Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface Props {
  player: Player;
  label?: string;
  size?: number;
}

export default function PlayerIdentity({ player, label, size = 40 }: Props) {
  const t = useTranslations("App.PlayerCard");
  const href = player.publicSlug ? playerCardPath(player.publicSlug) : undefined;
  const photo = href && player.hasPublicPhoto ? `${href}/portrait` : undefined;

  return (
    <Link component={href ? "a" : "span"} href={href} underline={href ? "hover" : "none"}
      sx={{ display: "inline-flex", width: "fit-content", maxWidth: "100%", alignItems: "center", gap: 1 }}>
      <Box aria-hidden="true" sx={{ flexShrink: 0 }}>
        <PlayerProfile card={{ name: player.name, photo, badges: player.isFounderCard ? ["founder"] : [] }}
          labels={{ founder: t("founder"), played: "", created: "" }} size={size} compact />
      </Box>
      <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
        {label && <Typography component="span" variant="caption" color="text.secondary"
          sx={{ display: "block" }}>{label}</Typography>}
        <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
          {player.name}
        </Typography>
        {player.isFounderCard && (
          <Typography component="span" variant="caption" color="text.secondary"
            sx={{ display: "block" }}>{t("founder")}</Typography>
        )}
      </Box>
    </Link>
  );
}
