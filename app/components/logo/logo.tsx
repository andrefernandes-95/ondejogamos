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
            sx={{
              fontSize: 24,
              color: "white",
              animation: "myAnimation .1s ease-in-out forwards",
              "@keyframes myAnimation": {
                "0%": {
                  opacity: 0,
                  transform: `scale(2)`,
                },

                "100%": {
                  opacity: 0.15,
                  transform: `scale(1)`,
                },
              },
            }}
          />
          <SportsSoccerIcon
            sx={{
              fontSize: 24,
              marginLeft: -0.25,
              color: "white",
              animation: "myAnimation2 .25s ease-in-out forwards",
              "@keyframes myAnimation2": {
                "0%": {
                  opacity: 0,
                  transform: `scale(2)`,
                },

                "100%": {
                  opacity: 0.25,
                  transform: `scale(1)`,
                },
              },
            }}
          />
          <SportsSoccerIcon
            sx={{
              fontSize: 24,
              marginLeft: -0.25,
              color: "white",
              animation: "myAnimation3 .5s ease-in-out forwards",
              "@keyframes myAnimation3": {
                "0%": {
                  opacity: 0,
                  transform: `scale(2)`,
                },

                "100%": {
                  opacity: 1,
                  transform: `scale(1)`,
                },
              },
            }}
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
