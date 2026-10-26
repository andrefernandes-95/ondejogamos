"use client";

import {
  Avatar,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

interface PlayerProfileProps {
  name: string;
  image?: string | null;
}

export default function PlayerProfile({ name, image }: PlayerProfileProps) {
  const t = useTranslations();

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        {t("App.PlayerProfile.title")}
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Stack sx={{ alignItems: "center", gap: 2 }}>
            <Avatar
              src={image ?? undefined}
              alt={name}
              sx={{ width: 112, height: 112 }}
            >
              {name.trim().charAt(0).toLocaleUpperCase()}
            </Avatar>
            <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
              {name}
            </Typography>
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Stack spacing={2}>
            <ProfileField
              label={t("App.PlayerProfile.preferred_position")}
              value={t("App.PlayerProfile.not_set")}
            />
            <ProfileField
              label={t("App.PlayerProfile.preferred_area")}
              value={t("App.PlayerProfile.not_set")}
            />
            <ProfileField
              label={t("App.PlayerProfile.matches")}
              value={t("App.PlayerProfile.unavailable")}
            />
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <Stack sx={{ flexDirection: "row", justifyContent: "space-between", gap: 2 }}>
      <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
      <Typography color="text.secondary">{value}</Typography>
    </Stack>
  );
}
