import CreatePitchButton from "@/app/components/create-pitch-button/create-pitch-button";
import DeletePitch from "@/app/components/delete-pitch-button/delete-pitch-button";
import PageTitle from "@/app/components/page-title/page-title";
import PitchUrlButton from "@/app/components/pitch-url-button/pitch-url-button";
import useLocalization from "@/app/hooks/locale";
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

export default function PitchList({ data }: { data: PitchFull[] }) {
  const isEn = useLocalization() === "EN";

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <PageTitle title={isEn ? "Pitch List" : "Campos Registados"} />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{isEn ? "Image" : "Imagem"}</TableCell>
              <TableCell>{isEn ? "Name" : "Nome"}</TableCell>
              <TableCell>{isEn ? "Municipality" : "Município"}</TableCell>
              <TableCell>{isEn ? "Area" : "Área"}</TableCell>
              <TableCell>{isEn ? "Date Added" : "Data de Registo"}</TableCell>
              <TableCell>{isEn ? "Added By" : "Adicionado Por"}</TableCell>{" "}
              <TableCell>
                {isEn ? "Games Scheduled" : "Jogos Criados"}
              </TableCell>
              <TableCell>{isEn ? "Actions" : "Ações"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((pitch) => {
              const weekDay = new Intl.DateTimeFormat(isEn ? "en" : "pt-PT", {
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
