import PlayerProfile, { type CardLabels } from "./player-profile";
import type { CardContent } from "@/app/models/player-card";
import { Stack, Typography } from "@mui/material";

interface Props {
  card: CardContent;
  labels: CardLabels;
  preview?: string;
}

export default function CardStage({ card, labels, preview }: Props) {
  return (
    <Stack spacing={2} sx={{
      alignItems: "center", alignSelf: "start",
      px: { xs: 2, sm: 3 }, py: 3,
    }}>
      {preview && <Typography component="h2" variant="subtitle2" color="primary">{preview}</Typography>}
      <PlayerProfile card={card} labels={labels} size={preview ? 225 : 290} />
    </Stack>
  );
}
