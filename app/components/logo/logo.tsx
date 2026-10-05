import { Stack, Typography } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
export const Logo = () => {
  return (
    <Stack sx={{ gap: 1, flexDirection: "row", alignItems: "center" }}>
      <Stack sx={{ flexDirection: "row" }}>
        <SportsSoccerIcon sx={{ opacity: 0.25 }} color="primary" />
        <SportsSoccerIcon sx={{ opacity: 0.5 }} color="primary" />
        <SportsSoccerIcon color="primary" />
      </Stack>
      <Typography variant="h5" sx={{ fontWeight: 900 }} color="primary">
        onde jogamos?
      </Typography>
    </Stack>
  );
};
