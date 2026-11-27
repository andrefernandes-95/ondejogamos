import { OpenInNew } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

export default function PitchUrlButton({
  maps_url,
  showLabel = false,
}: {
  maps_url: string;
  showLabel?: boolean;
}) {
  const tApp = useTranslations();
  return (
    <Button href={maps_url} size="small" target="_blank" rel="noopener noreferrer"
      aria-label={showLabel ? undefined : tApp("App.PitchUrlButton.open_in_google_maps")}
      sx={{ alignSelf: "flex-start", minWidth: 44, gap: 1 }}>
      {showLabel && tApp("App.MatchDetailsPage.directions")}
      <OpenInNew sx={{ fontSize: 16 }} />
    </Button>
  );
}
