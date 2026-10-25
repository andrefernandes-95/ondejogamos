"use client";

import { PlayerProfilePublicDto } from "@/app/models/player-profile";
import { Edit } from "@mui/icons-material";
import { Avatar, Card, CardContent, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface PlayerProfileCardProps {
  profile: PlayerProfilePublicDto;
  onEdit: () => void;
}

export function PlayerProfileCard({ profile, onEdit }: PlayerProfileCardProps) {
  const t = useTranslations();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack sx={{ alignItems: "center", gap: 2 }}>
          <Avatar src={profile.image ?? undefined} alt={profile.name} sx={{ width: 112, height: 112 }}>
            {profile.name.trim().charAt(0).toLocaleUpperCase()}
          </Avatar>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
              {profile.name}
            </Typography>
            <IconButton aria-label={t("App.PlayerProfile.edit_profile")} onClick={onEdit}>
              <Edit />
            </IconButton>
          </Stack>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Stack spacing={2}>
          <ProfileField label={t("App.PlayerProfile.age")} value={profile.age === null ? t("App.PlayerProfile.not_set") : t("App.PlayerProfile.years_old", { age: profile.age })} />
          <ProfileField label={t("App.PlayerProfile.preferred_position")} value={profile.preferred_position ? t(`App.PlayerProfile.positions.${profile.preferred_position}`) : t("App.PlayerProfile.not_set")} />
          <ProfileField label={t("App.PlayerProfile.preferred_area")} value={profile.preferred_area ?? t("App.PlayerProfile.not_set")} />
          <ProfileField label={t("App.PlayerProfile.matches")} value={t("App.PlayerProfile.unavailable")} />
        </Stack>
      </CardContent>
    </Card>
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
