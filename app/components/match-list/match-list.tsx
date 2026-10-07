import MatchCard from "@/app/components/match-card/match-card";
import { useListMatchesForArea } from "@/app/hooks/matches";
import { Container, Stack } from "@mui/material";

interface Props {
  area: string;
}

export default function MatchList({ area }: Props) {
  const matches = useListMatchesForArea(area);
  return (
    <Stack sx={{ flexDirection: "column" }}>
      {matches.map((match) => (
        <MatchCard match={match} key={match.id} />
      ))}
    </Stack>
  );
}
