import { OpenInNew } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

export default function PitchUrlButton({
  maps_url,
  isSmall = false,
}: {
  maps_url: string;
  isSmall?: boolean;
}) {
  const tApp = useTranslations();
  return (
    <>
      {maps_url && (
        <Button
          component="a"
          href={maps_url}
          size="small"
          sx={{ minWidth: "unset" }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            tApp("App.PitchUrlButton.open_in_google_maps")
          }
        >
          <OpenInNew sx={{ fontSize: isSmall ? 14 : 18 }} />
        </Button>
      )}
    </>
  );
}
