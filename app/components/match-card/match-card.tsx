import { Card, Typography } from "@mui/material";
import Image from "next/image";

interface Props {
  match: any;
}

export default function MatchCard({ match }: Props) {
  console.log(match);
  return (
    <Card sx={{ flexDirection: "column" }}>
      <Typography variant="h5">{match.pitchname}</Typography>
      <Typography variant="h5" color="secondary">
        {match.pitchmunicipality} {match.pitcharea}
      </Typography>{" "}
      <Typography variant="h5" color="secondary">
        {match.starts_at}
      </Typography>
      <Image
        src={match.image_url}
        alt={match.image_url}
        width={80}
        height={80}
        style={{
          objectFit: "cover",
          borderRadius: 6,
        }}
      />
    </Card>
  );
}
