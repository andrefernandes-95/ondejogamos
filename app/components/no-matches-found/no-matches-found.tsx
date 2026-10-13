import { useTranslations } from "next-intl";
import ScheduleMatchButton from "@/app/components/schedule-match-button/schedule-match-button";
import { Card, Typography } from "@mui/material";

export default function NoMatchesFound({
  area,
  onAddPitch,
}: {
  area: string;
  onAddPitch: () => void;
}) {
  const t = useTranslations();
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
          {t("Match.noMatchesInArea", { area })}
        </Typography>
      ) : (
        <Typography>
          {t("Match.noMatches")}
        </Typography>
      )}
      <ScheduleMatchButton selectedArea={area} onAddPitch={onAddPitch} />
    </Card>
  );
}
