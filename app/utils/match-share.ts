import type { Metadata } from "next";
import type { FullMatch } from "@/app/models/match";
import { formatMatchDate } from "./match-date";

export type ShareableMatch = Pick<FullMatch, "id" | "format" | "starts_at" | "pitch">;

function matchLocation(match: ShareableMatch) {
  return [match.pitch.municipality, match.pitch.area].filter(Boolean).join(", ");
}

function matchPhoto(imageUrl?: string) {
  try {
    if (imageUrl && new URL(imageUrl).protocol === "https:") return imageUrl;
  } catch {
    // Fall back to the site's own share image.
  }
  return "/og-image.png";
}

export function matchShareMetadata(match: ShareableMatch, locale: string): Metadata {
  const portuguese = locale.toLowerCase().startsWith("pt");
  const { day, time } = formatMatchDate(match.starts_at, locale, true);
  const venue = match.pitch.name || (portuguese ? "campo" : "pitch");
  const location = matchLocation(match);
  const title = portuguese
    ? `Futebol ${match.format} no ${venue} | Onde Jogamos`
    : `Football ${match.format} at ${venue} | Onde Jogamos`;
  const description = portuguese
    ? `Jogo em ${location}. ${day}, às ${time}. Junta-te à futebolada no Onde Jogamos.`
    : `Match in ${location}. ${day}, at ${time}. Join the game on Onde Jogamos.`;
  const url = `https://ondejogamos.com/match/${match.id}`;
  const image = matchPhoto(match.pitch.image_url);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Onde Jogamos",
      type: "website",
      locale: portuguese ? "pt_PT" : "en_US",
      images: [{ url: image, alt: venue }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function matchWhatsAppText(match: ShareableMatch, locale: string): string {
  const portuguese = locale.toLowerCase().startsWith("pt");
  const { day, time } = formatMatchDate(match.starts_at, locale, true);
  const venue = match.pitch.name || (portuguese ? "campo" : "pitch");
  const location = matchLocation(match);
  return portuguese
    ? `⚽ Futebol ${match.format} no ${venue} (${location})\n📅 ${day}, ${time}\nBora jogar?`
    : `⚽ Football ${match.format} at ${venue} (${location})\n📅 ${day}, ${time}\nWant to play?`;
}
