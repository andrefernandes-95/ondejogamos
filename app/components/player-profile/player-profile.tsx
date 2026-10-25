"use client";

import { EditPlayerProfileDialog } from "@/app/components/player-profile/edit-player-profile-dialog";
import { PlayerProfileCard } from "@/app/components/player-profile/player-profile-card";
import { PlayerProfileEditingPayload, PlayerProfilePublicDto } from "@/app/models/player-profile";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container, Typography } from "@mui/material";

interface PlayerProfileProps {
  editingProfile: PlayerProfileEditingPayload;
  areas: string[];
}

export default function PlayerProfile({ editingProfile, areas }: PlayerProfileProps) {
  const t = useTranslations();
  const [committedProfile, setCommittedProfile] = useState(editingProfile);
  const [editorOpen, setEditorOpen] = useState(false);
  const displayedProfile = toPublicProfile(committedProfile);

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        {t("App.PlayerProfile.title")}
      </Typography>
      <PlayerProfileCard profile={displayedProfile} onEdit={() => setEditorOpen(true)} />
      {editorOpen && (
        <EditPlayerProfileDialog
          initialProfile={committedProfile}
          areas={areas}
          onClose={() => setEditorOpen(false)}
          onSaved={(profile) => {
            setCommittedProfile(profile);
            setEditorOpen(false);
          }}
        />
      )}
    </Container>
  );
}

function toPublicProfile(profile: PlayerProfileEditingPayload | PlayerProfilePublicDto): PlayerProfilePublicDto {
  return {
    id: profile.id,
    name: profile.name,
    image: profile.image,
    age: profile.age,
    matches_played: profile.matches_played,
    preferred_area: profile.preferred_area,
    preferred_position: profile.preferred_position,
  };
}
