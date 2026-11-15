import type { CardFinish } from "./card-finish";

interface Props {
  size: number;
  finish: CardFinish;
  photo?: string;
  name: string;
}

export default function CardPortrait({ size, finish, photo, name }: Props) {
  const diameter = size * 0.64;
  const initials = name.trim().split(/\s+/).slice(0, 2).map((word) => [...word][0]).join("");
  return (
    <div style={{
      display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "center",
      width: diameter, height: diameter, borderRadius: "50%",
      border: `${size * 0.005}px solid ${finish.trim}`,
      backgroundImage: `linear-gradient(138deg, ${finish.highlight}, ${finish.metal} 53%, ${finish.trim})`,
      padding: size * 0.014,
    }}>
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%",
        borderRadius: "50%", overflow: "hidden", border: `${size * 0.005}px solid ${finish.depth}`,
        backgroundImage: `radial-gradient(${finish.face}, ${finish.depth})`,
        color: finish.accent, fontWeight: 800, fontSize: size * 0.19,
      }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- shared with ImageResponse
          <img src={photo} alt="" style={{
            width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%",
          }} />
        ) : <span>{initials.toUpperCase()}</span>}
      </div>
    </div>
  );
}
