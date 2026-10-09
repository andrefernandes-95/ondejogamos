"use client";

import AuthNavbar from "@/app/components/auth-navbar/auth-navbar";
import { Background } from "@/app/components/background/background";
import { Logo } from "@/app/components/logo/logo";
import ParticipateButton from "@/app/components/participate-button/participate-button";
import { FullMatch } from "@/app/models/match";
import { AppRoutes } from "@/app/utils/routes";
import {
  AccessTime,
  CalendarMonth,
  ChevronLeft,
  Group,
  Groups,
  LocationPin,
  ManageAccounts,
  MyLocation,
  OpenInNew,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  List,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MatchDetailsPage({ match }: { match: FullMatch }) {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  console.log("match:", match);

  const weekDay = new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "narrow",
    year: "2-digit",
    timeZone: "Europe/Lisbon",
  }).format(new Date(match.starts_at));

  const time = new Intl.DateTimeFormat("pt-PT", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Lisbon",
  }).format(new Date(match.starts_at));

  const hasEnoughPlayers = match.attendances.length + 1 >= match.min_attendance;

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
    } catch {
      setServerError("Não foi possível aderir ao jogo");
    }

    router.refresh();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Background />
      <Stack sx={{ gap: 2 }}>
        <Button
          component="a"
          href={AppRoutes.HOME}
          sx={{
            flexGrow: 0,
            alignSelf: "flex-start",
            gap: 1,
          }}
        >
          <ChevronLeft /> <Typography variant="body1">Voltar atrás</Typography>
        </Button>

        <Card
          variant="outlined"
          sx={{
            flexDirection: "column",
            borderRadius: 6,
            p: 1,
          }}
        >
          <Stack
            sx={{
              flexDirection: {
                sx: "column",
                md: "row",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: {
                  sx: "100%",
                  md: "50%",
                },
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
              ></Stack>
            </Box>
            <Stack sx={{ p: 2, gap: 2, flexGrow: 1 }}>
              {/** Date */}
              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}
              >
                <CalendarMonth sx={{ fontSize: 28 }} />
                <Typography
                  variant="h5"
                  color="textPrimary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {weekDay}
                </Typography>
              </Stack>

              {/** Time */}

              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}
              >
                <AccessTime sx={{ fontSize: 28 }} />
                <Typography
                  variant="h5"
                  color="textPrimary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {time}
                </Typography>
              </Stack>

              <Divider />

              {/** Pitch */}
              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}
              >
                <MyLocation sx={{ fontSize: 24 }} />
                <Typography variant="body1" color="textPrimary">
                  Local: <strong>{match.pitch.name}</strong>
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

              {/** Locality */}

              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}
              >
                <LocationPin sx={{ fontSize: 24 }} />
                <Typography variant="body1" color="textPrimary">
                  {match.pitch.municipality}, {match.pitch.area}
                </Typography>
              </Stack>

              <Divider />

              {/** Match Creator */}

              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}
              >
                <ManageAccounts sx={{ fontSize: 24 }} />
                <Typography variant="body1" color="textPrimary">
                  Organizado por <strong>{match.creator.name}</strong>
                </Typography>
              </Stack>

              {/** Format */}
              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}
              >
                <Group sx={{ fontSize: 24 }} />
                <Typography variant="body1" color="textPrimary">
                  Formato da partida: <strong>{match.format}</strong>
                </Typography>
              </Stack>

              <Divider />

              {/** Attendance */}

              <Stack
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 0.5,
                }}
              >
                <Stack sx={{ flexDirection: "row", gap: 1 }}>
                  <Group color={hasEnoughPlayers ? "warning" : "success"} />

                  {hasEnoughPlayers && (
                    <Typography variant="body1" color="warning">
                      Já há jogadores suficientes
                    </Typography>
                  )}

                  {!hasEnoughPlayers && (
                    <Typography variant="body1" color="success">
                      Ainda faltam{" "}
                      {Number(
                        match.min_attendance - 1 - match.attendances.length,
                      )}{" "}
                      jogadores!
                    </Typography>
                  )}
                </Stack>

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
              </Stack>
            </Stack>
          </Stack>
        </Card>

        <Card
          variant="outlined"
          sx={{
            flexDirection: "column",
            borderRadius: 6,
            p: 4,
          }}
        >
          <Stack
            sx={{
              flexDirection: {
                sx: "column",
                gap: 10,
                p: 10,
              },
            }}
          >
            <Stack
              sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}
            >
              <Groups sx={{ fontSize: 24 }} />
              <Typography variant="body1" color="textPrimary">
                Lista de Inscritos
              </Typography>
            </Stack>

            <List>
              <li key="organizer">
                <RenderPlayer
                  attendance={{
                    user_id: match.creator.id,
                    user_name: match.creator.name,
                    created_at: (match.created_at ?? "").toString(),
                  }}
                />
              </li>
              {match.attendances.map((attendance) => (
                <li key={attendance.user_id}>
                  <RenderPlayer attendance={attendance} />
                </li>
              ))}
            </List>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

const RenderPlayer = ({
  attendance,
}: {
  attendance: { user_id: string; user_name: string; created_at: string };
}) => (
  <Stack>
    <Typography variant="body1">{attendance.user_name}</Typography>
  </Stack>
);
