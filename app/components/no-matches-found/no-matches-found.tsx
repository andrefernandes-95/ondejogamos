import { SportsSoccerOutlined } from "@mui/icons-material";
import { Avatar, Card, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function NoMatchesFound({ area }: { area: string }) {
  const t = useTranslations("App.NoMatchesFound");

  return (
    <Card variant="outlined" sx={{ px: 2, py: { xs: 3.5, sm: 4 }, textAlign: "center" }}>
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <Avatar sx={{ bgcolor: "primary.light", color: "primary.contrastText", width: 44, height: 44 }}>
          <SportsSoccerOutlined />
        </Avatar>
        <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
          {area ? t("no_matches_scheduled_in_area", { area }) : t("no_matches_yet")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(area ? "try_another_area" : "start_first_match")}
        </Typography>
      </Stack>
    </Card>
  );
}
