"use client";

import { useTranslations, useLocale } from "next-intl";

import AuthNavbar from "@/app/components/auth-navbar/auth-navbar";
import { Background } from "@/app/components/background/background";
import DeleteMatch from "@/app/components/delete-match-button/delete-match-button";
import EditMatch from "@/app/components/edit-match/edit-match";
import { Logo } from "@/app/components/logo/logo";
import MatchShareButtons from "@/app/components/match-share-buttons/match-share-buttons";
import ParticipateButton from "@/app/components/participate-button/participate-button";
import { FullMatch } from "@/app/models/match";
import { AppRoutes } from "@/app/utils/routes";
import {
  AccessTime,
  CalendarMonth,
  ChevronLeft,
  Edit,
  Group,
  Groups,
  LocationPin,
  ManageAccounts,
  MyLocation,
  OpenInNew,
  TimeToLeave,
} from "@mui/icons-material";
import {
  Alert,
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
  const t = useTranslations();
  const locale = useLocale();
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const weekDay = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "narrow",
    year: "2-digit",
    timeZone: "Europe/Lisbon",
  }).format(new Date(match.starts_at));

  const time = new Intl.DateTimeFormat(locale, {
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
        setServerError(t("Match.attendanceError"));
        return;
      }
    } catch {
      setServerError(t("Match.attendanceError"));
    }

    router.refresh();
  };

  const isCreator = match.is_creator;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Background />
      <Stack sx={{ gap: 2 }}>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            component="a"
            href={AppRoutes.HOME}
            sx={{
              flexGrow: 0,
              alignSelf: "flex-start",
              gap: 1,
            }}
          >
            <ChevronLeft />{" "}
            <Typography variant="body1">{t("Common.back")}</Typography>
          </Button>

          {isCreator && (
            <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
              <EditMatch match={match} />
              <DeleteMatch match={match} />
            </Stack>
          )}
        </Stack>

        {serverError && (
          <Alert variant="filled" severity="error">
            {serverError}
          </Alert>
        )}

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
                alt={t("Pitch.photo", { name: match.pitch.name ?? "" })}
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
                  {t("Match.location")}: <strong>{match.pitch.name}</strong>
                </Typography>

                {match.pitch.maps_url && (
                  <Button
                    component="a"
                    href={match.pitch.maps_url}
                    size="small"
                    sx={{ minWidth: "unset" }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("Common.openMaps")}
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
                  {t("Match.organizedBy")} <strong>{match.creator.name}</strong>
                </Typography>
              </Stack>

              {/** Format */}
              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}
              >
                <Group sx={{ fontSize: 24 }} />
                <Typography variant="body1" color="textPrimary">
                  {t("Match.formatLabel")}: <strong>{match.format}</strong>
                </Typography>
              </Stack>

              {/** Duration */}
              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}
              >
                <AccessTime sx={{ fontSize: 24 }} />
                <Typography variant="body1" color="textPrimary">
                  {t("Match.duration")}: <strong>{t("Match.minutes", { count: match.duration_in_minutes })}</strong>
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
                      {t("Match.enoughPlayers")}
                    </Typography>
                  )}

                  {!hasEnoughPlayers && (
                    <Typography variant="body1" color="success">
                      {t("Match.missingPlayers", { count: Number(match.min_attendance - 1 - match.attendances.length) })}
                    </Typography>
                  )}
                </Stack>

                {match.is_creator ? (
                  <Typography variant="caption">{t("Match.createdByYou")}</Typography>
                ) : !match.is_attending ? (
                  <ParticipateButton handleAttendance={handleAttendance} />
                ) : (
                  <Button
                    variant="text"
                    onClick={() => handleAttendance({ isAttending: false })}
                  >
                    {t("Match.cancelAttendance")}
                  </Button>
                )}
              </Stack>
              <Divider />
              <Stack sx={{ alignSelf: "flex-end" }}>
                <MatchShareButtons id={match.id!} />
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
                {t("Match.attendees")}
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
