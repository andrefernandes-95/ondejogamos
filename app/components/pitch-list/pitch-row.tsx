import MatchPitchPhoto from "@/app/components/match-card/match-pitch-photo";
import { Card, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export default function PitchRow({ name, locality, image, heading = "h3", details, actions, children }: {
  name: string;
  locality: string;
  image?: string | null;
  heading?: "h2" | "h3";
  details?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card component="li" variant="outlined" sx={{
      listStyle: "none", p: { xs: 1.5, sm: 2 }, borderRadius: 3, display: "grid",
      gridTemplateColumns: { xs: "76px minmax(0, 1fr)", md: "140px minmax(0, 1fr) auto" },
      gap: { xs: 1, md: 2 }, alignItems: "center",
    }}>
      <MatchPitchPhoto src={image} compact />
      <Stack spacing={0.25} sx={{ overflowWrap: "anywhere" }}>
        <Typography component={heading} sx={{ fontWeight: 800 }}>{name}</Typography>
        <Typography variant="body2" color="text.secondary">{locality}</Typography>
        {details}
      </Stack>
      {actions && (
        <Stack direction="row" sx={{
          gap: 0.75, flexWrap: "wrap", gridColumn: { xs: "1 / -1", md: "auto" },
          pt: { xs: 1, md: 0 }, pl: { md: 1.5 },
        }}>
          {actions}
        </Stack>
      )}
      {children}
    </Card>
  );
}
