import PlayerProfile from "@/app/components/player-profile/player-profile";
import type { CardBadge } from "@/app/models/player-card";
import type { PlayerIdentity as Player } from "@/app/models/player-identity";
import { playerCardPath } from "@/app/utils/player-card";
import { Avatar, Box, Link, Stack, Typography } from "@mui/material";

interface Props {
  player: Player;
  label?: string;
  preview?: { badges: CardBadge[]; founderLabel: string };
}

export default function PlayerIdentity({ player, label, preview }: Props) {
  const href = player.publicUsername ? playerCardPath(player.publicUsername) : undefined;
  const photo = href && player.hasPublicPhoto ? `${href}/portrait` : undefined;
  const content = (
    <>
      {preview && href ? (
        <Box aria-hidden="true" sx={{ flexShrink: 0 }}>
          <PlayerProfile card={{ name: player.name, photo, badges: preview.badges }}
            labels={{ founder: preview.founderLabel, played: "", created: "" }} size={64} />
        </Box>
      ) : (
        <Avatar src={photo} alt="" aria-hidden="true" slotProps={{ img: { loading: "lazy" } }}
          sx={{ width: 32, height: 32, flexShrink: 0, bgcolor: "primary.main", fontSize: "0.875rem" }}>
          {Array.from(player.name.trim())[0]?.toUpperCase()}
        </Avatar>
      )}
      <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
        {label && <Typography component="span" variant="caption" color="text.secondary"
          sx={{ display: "block" }}>{label}</Typography>}
        <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
          {player.name}
        </Typography>
        {href && preview?.badges.includes("founder") && (
          <Typography component="span" variant="caption" color="text.secondary"
            sx={{ display: "block" }}>{preview.founderLabel}</Typography>
        )}
      </Box>
    </>
  );
  const layout = { width: "fit-content", maxWidth: "100%", alignItems: "center", gap: 1 };

  return href ? (
    <Link href={href} underline="hover" sx={{ display: "inline-flex", ...layout }}>{content}</Link>
  ) : (
    <Stack direction="row" sx={layout}>{content}</Stack>
  );
}
