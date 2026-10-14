import { AppRoutes } from "@/app/utils/routes";
import {
  Button,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Metadata } from "next";

const title = "Pickup Football in Portugal | Onde Jogamo";

const description =
  "Find casual football games in Portugal. Join local players and expats, organize a match and find your next football game.";

const url = "https://ondejogamos.com/pickup-football-portugal";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: "Onde Jogamos",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default function PickupFootballPage() {
  return (
    <Container maxWidth="md" lang="en" sx={{ py: 2 }}>
      <Card variant="outlined">
        <Stack sx={{ gap: 2, p: 2 }}>
          <Typography variant="h6">
            Find pickup football games in Portugal
          </Typography>

          <Typography>
            Meet local players and expats and join a football game near you
          </Typography>

          <Button component="a" href={AppRoutes.HOME}>
            Join a game
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
