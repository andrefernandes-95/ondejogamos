import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import { Card, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function NoMatchesFound({
  area,
  onAddPitch,
}: {
  area: string;
  onAddPitch: () => void;
}) {
  const tApp = useTranslations();

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
          {tApp("App.NoMatchesFound.no_matches_scheduled_in_area", { area })}
        </Typography>
      ) : (
        <Typography>
          {tApp("App.NoMatchesFound.no_matches_scheduled_be_the_first")}
        </Typography>
      )}
      <ScheduleMatchButton selectedArea={area} onAddPitch={onAddPitch} />
    </Card>
  );
}
