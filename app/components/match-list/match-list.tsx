import MatchCard from "@/app/components/match-card/match-card";
import NoMatchesFound from "@/app/components/no-matches-found/no-matches-found";
import { useListMatchesForArea } from "@/app/hooks/matches";
import { Alert, Box, CircularProgress, Container, Stack } from "@mui/material";

interface Props {
  area: string;
  onAddPitch: () => void;
}

export default function MatchList({ area, onAddPitch }: Props) {
  const { matches, refresh, error, loading, hasFetched } =
    useListMatchesForArea(area);

  if (loading || !hasFetched) {
    return (
      <Container
        sx={{
          p: 1,
          display: "flex",
          flex: 1,
          height: 200,
          alignItems: "center",
          justifyContent: "center",
        }}
        maxWidth="lg"
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Alert variant="filled" severity="error">
        {error}
      </Alert>
    );
  }

  if (!matches.length) {
    return <NoMatchesFound area={area} onAddPitch={onAddPitch} />;
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
