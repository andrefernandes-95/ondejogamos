import type { CardContent } from "@/app/models/player-card";
import type { CardLabels } from "./player-profile";

export default function CardRecord({ card, labels, size, accent }: {
  card: CardContent;
  labels: CardLabels;
  size: number;
  accent: string;
}) {
  const stats = [
    { value: card.played, label: labels.played },
    { value: card.created, label: labels.created },
  ].filter(({ value }) => value !== undefined);

  if (!stats.length) return null;
  return (
    <div style={{
      display: "flex", justifyContent: "center", gap: size * 0.04,
      borderTop: "1px solid #ffffff47", width: "100%", paddingTop: size * 0.022,
    }}>
      {stats.map(({ value, label }) => (
        <div key={label} style={{
          display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0,
        }}>
          <span style={{ color: accent, fontSize: size * 0.087, lineHeight: 1, fontWeight: 800 }}>{value}</span>
          <span style={{ fontSize: size * 0.04, maxWidth: "100%", marginTop: size * 0.012 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
