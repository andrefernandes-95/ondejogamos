import { AppRoutes } from "@/app/utils/routes";
import PageContainer from "@/app/components/page-container/page-container";
import PageTitle from "@/app/components/page-title/page-title";
import {
  Button,
  Card,
  Stack,
} from "@mui/material";
import { Metadata } from "next";

const title = "Pickup Football in Portugal | Onde Jogamos";

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
    <PageContainer maxWidth="md">
      <Card variant="outlined" lang="en">
        <Stack spacing={2} sx={{ alignItems: "flex-start", p: { xs: 1, sm: 2 } }}>
          <PageTitle title="Find pickup football games in Portugal"
            description="Meet local players and expats and join a football game near you." />
          <Button href={AppRoutes.GAMES} variant="contained">
            Join a game
          </Button>
        </Stack>
      </Card>
    </PageContainer>
  );
}
