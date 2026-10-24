"use client";

import { useTranslations } from "next-intl";

import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";

export default function PlayerProfile() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
        <Box
          sx={{
            width: 250,
            height: 100,
            background: "#ada15a",
            borderRadius: "50%",
            transform: "translateY(50%)",
          }}
        >
          <Box
            sx={(theme) => ({
              width: 100,
              height: 100,
              background: theme.palette.background.default,
              borderRadius: "50%",
              position: "absolute",
              left: -50,
              bottom: 50,
            })}
          />
          <Box
            sx={(theme) => ({
              width: 100,
              height: 100,
              background: theme.palette.background.default,
              borderRadius: "50%",
              position: "absolute",
              right: -50,
              bottom: 50,
            })}
          />
        </Box>
        <Box
          sx={{
            position: "relative",
            width: 260,
            height: 500,
            backgroundImage: `linear-gradient(to top, #766e3d, #ada15a 25%)`,
          }}
        >
          <CardContent />
        </Box>
        <Box
          sx={{
            width: 250,
            background: "#ada15a",
            borderRadius: "50%",
            transform: "translateY(50%)",
          }}
        >
          <Box
            sx={(theme) => ({
              width: 300,
              height: 100,
              background: theme.palette.background.default,
              borderRadius: "50%",
              position: "absolute",
              bottom: -65,
              left: -125,
            })}
          />
          <Box
            sx={(theme) => ({
              width: 300,
              height: 100,
              background: theme.palette.background.default,
              borderRadius: "50%",
              position: "absolute",
              bottom: -65,
              right: -125,
            })}
          />
        </Box>
      </Stack>
    </Container>
  );
}

const CardContent = () => {
  const t = useTranslations();

  return (
  <Stack
    sx={{
      display: "flex",
      justifyContent: "center",
      p: 1,
      paddingTop: 0,
      gap: 1,
    }}
  >
    <Typography sx={{ fontWeight: 900, alignSelf: "center" }} variant="h5">
      {t("App.PlayerProfile.name")}
    </Typography>
    <Divider />
    <Image
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQQtHWmlKO7HKtxl4tNQDjH_KsWXyd-HD3i0TTLQn-_D-XgdPuPiY-yGew&s=10"
      alt={t("App.PlayerProfile.photo_alt")}
      width="150"
      height="150"
      style={{
        objectFit: "contain",
        alignSelf: "center",
        margin: 12,
      }}
    />
    <Stack
      sx={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <Typography sx={{ alignSelf: "center" }} variant="h5">
        🇵🇹
      </Typography>
      <Typography sx={{ fontWeight: 700 }}>{t("App.PlayerProfile.position")}</Typography>
    </Stack>
    <Divider />
    <Stack
      sx={{
        p: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <RenderCol label={t("App.PlayerProfile.matches")} value="12" />
      <RenderCol label={t("App.PlayerProfile.goals")} value="10" />
      <RenderCol label={t("App.PlayerProfile.assists")} value="10" />
    </Stack>
    <Divider />
    <Stack
      sx={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        p: 1,
      }}
    >
      <RenderCol label={t("App.PlayerProfile.preferred_area")} value="Santarém" />
    </Stack>
  </Stack>
  );
};

const RenderCol = ({ label, value }: { label: string; value: string }) => (
  <Stack
    sx={{
      flexDirection: "column",
      gap: 0.5,
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography sx={{ fontWeight: 700, fontSize: 14 }} variant="caption">
      {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Stack>
);
