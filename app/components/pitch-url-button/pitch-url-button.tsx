import useLocalization from "@/app/hooks/locale";
import { OpenInNew } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function PitchUrlButton({
  maps_url,
  isSmall = false,
}: {
  maps_url: string;
  isSmall?: boolean;
}) {
  const isEn = useLocalization() === "EN";
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
            isEn ? "Open in Google Maps" : "Abrir localização no Google Maps"
          }
        >
          <OpenInNew sx={{ fontSize: isSmall ? 14 : 18 }} />
        </Button>
      )}
    </>
  );
}
