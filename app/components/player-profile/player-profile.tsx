import { BrandMark } from "@/app/components/logo/brand-mark";
import type { CardContent } from "@/app/models/player-card";
import { cardFinish, cardFrameFilename } from "./card-finish";
import CardPortrait from "./card-portrait";
import CardRecord from "./card-record";

export interface CardLabels {
  founder: string;
  played: string;
  created: string;
}

interface Props {
  card: CardContent;
  labels: CardLabels;
  size?: number;
  frameUrl?: string;
}

export default function PlayerProfile({ card, labels, size = 340, frameUrl }: Props) {
  const founder = card.badges[0] === "founder";
  const finish = cardFinish(founder);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", width: size, maxWidth: "100%", minHeight: size * 1.54,
      boxSizing: "border-box", padding: `${size * 0.15}px ${size * 0.09}px ${size * 0.12}px`,
      gap: size * 0.032, color: "white", textAlign: "center",
      backgroundImage: `url("${frameUrl ?? `/card-frames/${cardFrameFilename(founder)}`}")`,
      backgroundSize: "100% 100%", backgroundRepeat: "no-repeat",
    }}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: size * 0.032, width: "100%", position: "relative",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: size * 0.016,
          fontSize: size * 0.056, fontWeight: 900 }}>
          <BrandMark size={size * 0.052} />
          ondejogamos.com
        </div>
        <CardPortrait name={card.name} photo={card.photo} size={size} finish={finish} />
        <div style={{ display: "flex", flexDirection: "column", gap: size * 0.01, width: "100%" }}>
          <div style={{
            display: "flex", justifyContent: "center", fontWeight: 800, lineHeight: 1.12,
            fontSize: size * (card.name.length > 25 ? 0.062 : 0.09), overflowWrap: "break-word",
          }}>{card.name}</div>
          {(card.position || card.area) && (
            <div style={{ display: "flex", justifyContent: "center", fontSize: size * 0.048, color: finish.accent }}>
              {[card.position, card.area].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        <CardRecord card={card} labels={labels} size={size} accent={finish.accent} />
        {founder && (
          <div style={{
            display: "flex", borderRadius: 90, fontWeight: 800, fontSize: size * 0.038,
            letterSpacing: size * 0.007, color: finish.depth, textTransform: "uppercase",
            padding: `${size * 0.012}px ${size * 0.052}px`,
            backgroundImage: `linear-gradient(135deg, ${finish.highlight}, ${finish.trim})`,
          }}>{labels.founder}</div>
        )}
      </div>
    </div>
  );
}
