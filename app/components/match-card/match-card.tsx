import ParticipateButton from "@/app/components/participate-button/participate-button";
import { FullMatch } from "@/app/models/match";
import { AppRoutes } from "@/app/utils/routes";
import {
  AccessTime,
  CalendarMonth,
  Group,
  LocationPin,
  MyLocation,
  OpenInNew,
} from "@mui/icons-material";
import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

interface Props {
  match: FullMatch;
  onAttendanceChanged: () => void;
}

export default function MatchCard({ match, onAttendanceChanged }: Props) {
  const [serverError, setServerError] = useState("");

  const weekDay = new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "Europe/Lisbon",
  }).format(new Date(match.starts_at));

  const time = new Intl.DateTimeFormat("pt-PT", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Lisbon",
  }).format(new Date(match.starts_at));

  const handleAttendance = async ({
    isAttending,
  }: {
    isAttending: boolean;
  }) => {
    const body = new FormData();

    body.append("match_id", match.id);

    try {
      const response = await fetch(`/api/attendance`, {
        method: isAttending ? "POST" : "DELETE",
        body,
      });

      if (!response.ok) {
        setServerError("Não foi possível aderir ao jogo");
        return;
      }

      onAttendanceChanged?.();
    } catch {
      setServerError("Não foi possível aderir ao jogo");
    }
  };

  const hasEnoughPlayers = match.attendances.length + 1 >= match.min_attendance;

  return (
    <Card
      sx={(theme) => ({
        flexDirection: "column",
        borderRadius: 6,
        p: 1,
      })}
      variant="outlined"
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "2.5 /1",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <Image
          src={match.pitch.image_url!}
          alt={match.pitch.image_url!}
          fill
          sizes="(max-width: 600px) 100vw 50vw"
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
      <Box sx={{ p: 2 }}>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
            <CalendarMonth sx={{ fontSize: 18 }} />
            <Typography
              variant="body1"
              color="textPrimary"
              sx={{ textTransform: "capitalize" }}
            >
              {weekDay}
            </Typography>
          </Stack>

          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 18 }} />
            <Typography variant="body1" color="textSecondary">
              {time}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 1, mt: 1, opacity: 0.5 }} />
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
            <MyLocation />
            <Typography variant="body1" color="textPrimary">
              {match.pitch.name}
            </Typography>

            {match.pitch.maps_url && (
              <Button
                component="a"
                href={match.pitch.maps_url}
                size="small"
                sx={{ minWidth: "unset" }}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir localização no Google Maps"
              >
                <OpenInNew sx={{ fontSize: 18 }} />
              </Button>
            )}
          </Stack>

          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
            <LocationPin />
            <Typography variant="body1" color="textSecondary">
              {match.pitch.municipality}, {match.pitch.area}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 1, mt: 1, opacity: 0.5 }} />
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
            <Group />
            <Typography variant="body1" color="textPrimary">
              {match.format}
            </Typography>
          </Stack>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
            <Group color={hasEnoughPlayers ? "warning" : "success"} />

            {hasEnoughPlayers && (
              <Typography variant="body1" color="warning">
                Já há jogadores suficientes
              </Typography>
            )}

            {!hasEnoughPlayers && (
              <Typography variant="body1" color="success">
                Ainda faltam{" "}
                {Number(match.min_attendance - 1 - match.attendances.length)}{" "}
                jogadores!
              </Typography>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 1, mt: 1, opacity: 0 }} />

        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {match.is_creator ? (
            <Typography variant="caption">Agendaste este jogo</Typography>
          ) : !match.is_attending ? (
            <ParticipateButton handleAttendance={handleAttendance} />
          ) : (
            <Button
              variant="text"
              onClick={() => handleAttendance({ isAttending: false })}
            >
              Cancelar Participação
            </Button>
          )}

          <Button
            variant="text"
            component="a"
            href={AppRoutes.MATCH_DETAILS(String(match.id))}
            size="small"
            sx={{ minWidth: "unset" }}
            aria-label="Abrir detalhes da partida"
          >
            Ver detalhes
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
