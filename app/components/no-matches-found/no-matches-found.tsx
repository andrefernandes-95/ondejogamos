import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import { Card, Typography } from "@mui/material";

export default function NoMatchesFound({
  area,
  onAddPitch,
}: {
  area: string;
  onAddPitch: () => void;
}) {
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
      {area ? (
        <Typography>
          Ainda não há jogos agendados para {area}. Sê o(a) primeiro(a)!
        </Typography>
      ) : (
        <Typography>
          Ainda não há jogos agendados. Sê o(a) primeiro(a)!
        </Typography>
      )}
      <ScheduleMatchButton selectedArea={area} onAddPitch={onAddPitch} />
    </Card>
  );
}
