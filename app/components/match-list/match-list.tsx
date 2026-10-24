import MatchCard from "@/app/components/match-card/match-card";
import NoMatchesFound from "@/app/components/no-matches-found/no-matches-found";
import { FullMatch } from "@/app/models/match";
import { SportsSoccer } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  area: string;
  onAddPitch: () => void;
  matches: FullMatch[];
  refresh: () => Promise<void>;
  error: string;
  loading: boolean;
  hasFetched: boolean;
}

export default function MatchList({
  area,
  onAddPitch,
  matches,
  refresh,
  error,
  loading,
  hasFetched,
}: Props) {
  const tApp = useTranslations();

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
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack
        sx={{
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Stack
          sx={() => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 0.5,
            justifyContent: "flex-start",
          })}
        >
          <SportsSoccer
            color="primary"
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              marginRight: 0.5,
            }}
          />
          <Typography variant="h6">
            {area
              ? tApp("App.MatchList.upcoming_matches_in_area", { area })
              : tApp("App.MatchList.upcoming_matches")}
          </Typography>
        </Stack>

        <Typography variant="caption">
          {tApp("App.MatchList.join_a_scheduled_or_on_going_matches")}
        </Typography>
      </Stack>
      <Box
        sx={{
          marginTop: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 3,
        }}
      >
        {matches.map((match) => (
          <MatchCard
            match={match}
            key={match.id}
            onAttendanceChanged={refresh}
          />
        ))}
      </Box>
    </Card>
  );
}
