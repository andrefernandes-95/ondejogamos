import PlayerProfile from "@/app/components/player-profile/player-profile";
import { cardFrameFilename } from "@/app/components/player-profile/card-finish";
import { brandBlueLight } from "@/app/design/brand-colors";
import { readPortrait } from "@/app/lib/portrait-storage";
import type { CardContent } from "@/app/models/player-card";
import { renderRoundPortrait } from "@/app/utils/round-portrait";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { join } from "node:path";
import sharp from "sharp";

const noCache = { "Cache-Control": "private, no-store" };

export function missingCardMedia() {
  return new Response(null, { status: 404, headers: noCache });
}

export async function portraitResponse(key: string) {
  const bytes = await readPortrait(key);
  if (!bytes) return missingCardMedia();
  return new Response(new Uint8Array(bytes), {
    headers: { ...noCache, "Content-Type": "image/webp", "X-Content-Type-Options": "nosniff" },
  });
}

export async function playerCardPng(card: CardContent, key: string | null, story: boolean) {
  const t = await getTranslations("App.PlayerCard");
  const labels = {
    founder: t("founder"), played: t("played"), created: t("created"),
  };
  const portraitBytes = card.photo && key ? await readPortrait(key) : null;
  const portrait = portraitBytes
    ? `data:image/png;base64,${(await renderRoundPortrait(portraitBytes)).toString("base64")}`
    : undefined;
  const framePath = join(process.cwd(), "public", "card-frames", cardFrameFilename(card.badges[0] === "founder"));
  const frameUrl = `data:image/png;base64,${(await sharp(framePath).png().toBuffer()).toString("base64")}`;

  const response = new ImageResponse(
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      width: "100%", height: "100%",
      backgroundColor: brandBlueLight,
    }}>
      <PlayerProfile card={{ ...card, photo: portrait }} labels={labels} size={story ? 800 : 360} frameUrl={frameUrl} />
    </div>,
    {
      width: story ? 1080 : 1200,
      height: story ? 1920 : 630,
      headers: story ? { ...noCache, "Content-Disposition": 'attachment; filename="onde-jogamos.png"' } : noCache,
    },
  );
  return new Response(await response.arrayBuffer(), { headers: response.headers });
}
