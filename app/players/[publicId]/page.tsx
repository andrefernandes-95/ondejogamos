import PlayerProfile from "@/app/components/player-profile/player-profile";
import { getPublicCard } from "@/app/services/player-cards";
import { playerCardPath } from "@/app/utils/player-card";
import { Button, Container, Stack } from "@mui/material";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

export const dynamic = "force-dynamic";
const readCard = cache(getPublicCard);
type Props = { params: Promise<{ publicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  const result = await readCard(publicId);
  if (!result) notFound();
  const { card, username } = result;

  const title = `${card.name} · Onde Jogamos`;
  const origin = process.env.BETTER_AUTH_URL ?? (
    process.env.NODE_ENV === "production" ? "https://ondejogamos.com" : "http://localhost:3000"
  );
  const url = new URL(playerCardPath(username), origin);
  const image = new URL(`${url.pathname}/image`, origin);
  return {
    title,
    alternates: { canonical: url },
    robots: { index: false, follow: true },
    openGraph: { title, url, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}

export default async function PublicPlayerCard({ params }: Props) {
  const { publicId } = await params;
  const result = await readCard(publicId);
  if (!result) notFound();
  if (result.username !== publicId) redirect(playerCardPath(result.username));
  const t = await getTranslations("App.PlayerCard");

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3} sx={{ alignItems: "center" }}>
        <PlayerProfile card={result.card} labels={{
          founder: t("founder"), played: t("played"), created: t("created"),
        }} />
        <Button href="/" variant="contained">{t("find_games")}</Button>
      </Stack>
    </Container>
  );
}
