import CreatePitchButton from "@/app/components/create-pitch-button/create-pitch-button";
import DeletePitch from "@/app/components/delete-pitch-button/delete-pitch-button";
import PageTitle from "@/app/components/page-title/page-title";
import PitchUrlButton from "@/app/components/pitch-url-button/pitch-url-button";
import { PitchFull } from "@/app/services/pitches";
import {
  Box,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function PitchList({ data }: { data: PitchFull[] }) {
  const tApp = useTranslations();
  const locale = useLocale();

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <PageTitle title={tApp("App.PitchList.pitch_list")} />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{tApp("App.PitchList.image")}</TableCell>
              <TableCell>{tApp("App.PitchList.name")}</TableCell>
              <TableCell>{tApp("App.PitchList.municipality")}</TableCell>
              <TableCell>{tApp("App.PitchList.area")}</TableCell>
              <TableCell>{tApp("App.PitchList.date_added")}</TableCell>
              <TableCell>{tApp("App.PitchList.added_by")}</TableCell>{" "}
              <TableCell>
                {tApp("App.PitchList.games_scheduled")}
              </TableCell>
              <TableCell>{tApp("App.PitchList.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((pitch) => {
              const weekDay = new Intl.DateTimeFormat(locale, {
                day: "2-digit",
                month: "long",
                year: "numeric",
                timeZone: "Europe/Lisbon",
              }).format(new Date(pitch.created_at));

              return (
                <TableRow key={pitch.id}>
                  <TableCell>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "1/1",
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={pitch.image_url!}
                        alt={pitch.image_url!}
                        fill
                        style={{
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent 25%)`,
                          pointerEvents: "none",
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                      <Typography>{pitch.name}</Typography>
                      {pitch.maps_url && (
                        <PitchUrlButton maps_url={pitch.maps_url} isSmall />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography>{pitch.municipality}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{pitch.area}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{weekDay}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{pitch.created_by}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{pitch.game_count}</Typography>
                  </TableCell>
                  <TableCell>
                    {pitch.is_creator && <PitchAction pitch={pitch} />}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

const PitchAction = ({ pitch }: { pitch: PitchFull }) => {
  const [isCreatingPitch, setIsCreatingPitch] = useState(false);
  return (
    <Stack sx={{ flexDirection: "row" }}>
      <CreatePitchButton
        selectedArea={pitch.area}
        isCreatingPitch={isCreatingPitch}
        setIsCreatingPitch={setIsCreatingPitch}
        existingPitch={pitch}
        onUpdatePitch={() => {
          window.location.reload();
        }}
      />
      <DeletePitch pitch={pitch} />
    </Stack>
  );
};
