import MatchCard from "@/app/components/match-card/match-card";
import NoMatchesFound from "@/app/components/no-matches-found/no-matches-found";
import { useListMatchesForArea } from "@/app/hooks/matches";
import { Box, Container, Stack } from "@mui/material";

interface Props {
  area: string;
}

export default function MatchList({ area }: Props) {
  const { matches, refresh } = useListMatchesForArea(area);

  if (!matches.length) {
    return <NoMatchesFound area={area} />;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
        },
        gap: 3,
      }}
    >
      {matches.map((match) => (
        <MatchCard match={match} key={match.id} onAttendanceChanged={refresh} />
      ))}
    </Box>
  );
}
