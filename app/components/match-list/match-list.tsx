import MatchCard from "@/app/components/match-card/match-card";
import NoMatchesFound from "@/app/components/no-matches-found/no-matches-found";
import { useListMatchesForArea } from "@/app/hooks/matches";
import { Alert, Box, Skeleton } from "@mui/material";

export default function MatchList({ area, municipality }: { area: string; municipality: string }) {
  const { matches, refresh, error, loading, hasFetched } = useListMatchesForArea(area);

  if (loading || !hasFetched) {
    return <Skeleton variant="rounded" height={160} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const visibleMatches = municipality
    ? matches.filter((match) => match.pitch.municipality === municipality)
    : matches;

  if (!visibleMatches.length) {
    return <NoMatchesFound area={municipality || area} />;
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
      {visibleMatches.map((match) => (
        <MatchCard match={match} key={match.id} onAttendanceChanged={refresh} />
      ))}
    </Box>
  );
}
