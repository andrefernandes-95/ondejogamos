import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import { Card, Typography } from "@mui/material";

export default function NoMatchesFound({ area }: { area: string }) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography>Ainda não há jogos agendados para {area}</Typography>
      <ScheduleMatchButton selectedArea={area} />
    </Card>
  );
}
