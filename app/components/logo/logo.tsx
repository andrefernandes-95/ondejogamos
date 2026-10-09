import { Stack, Typography } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import Link from "next/link";
export const Logo = () => {
  return (
    <Stack sx={{ gap: 1, flexDirection: "row", alignItems: "center" }}>
      <Link
        href="/"
        style={{
          textDecoration: "none",
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Stack sx={{ flexDirection: "row" }}>
          <SportsSoccerIcon
            sx={{ opacity: 0.15, fontSize: 24, color: "white" }}
          />
          <SportsSoccerIcon
            sx={{
              opacity: 0.5,
              fontSize: 24,
              marginLeft: -0.25,
              color: "white",
            }}
          />
          <SportsSoccerIcon
            sx={{ opacity: 1, fontSize: 24, marginLeft: -0.25, color: "white" }}
          />
        </Stack>
        <Typography
          variant="h5"
          sx={{ fontWeight: 900, textTransform: "capitalize", color: "white" }}
        >
          onde jogamos
        </Typography>
      </Link>
    </Stack>
  );
};
