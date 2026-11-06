import { UserProfile } from "@/app/models/user-profile";
import { Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface Props {
  profile: UserProfile;
}

export default function ProfileForm({ profile }: Props) {
  const tApp = useTranslations();
  return (
    <Stack spacing={1}>
      <Typography component="h1" variant="h5">
        {tApp("App.ProfileForm.title")}
      </Typography>
      {profile.preferred_area && (
        <Typography color="text.secondary">
          {tApp("App.PlayerProfile.preferred_area")}: {profile.preferred_area}
        </Typography>
      )}
    </Stack>
  );
}
