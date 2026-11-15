"use client";

import ProfileForm from "@/app/components/profile-form/profile-form";
import { authClient } from "@/app/lib/auth-client";
import type { PlayerCardEditorData } from "@/app/models/player-card";
import { visibleCard } from "@/app/utils/player-card";
import { EditOutlined, LockOutlined, Public } from "@mui/icons-material";
import { Alert, Button, Chip, Stack, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CardLinkDialog from "./card-link-dialog";
import CardSharing from "./card-sharing";
import PlayerProfile from "./player-profile";

export default function OwnerCard({ initial }: { initial: PlayerCardEditorData }) {
  const t = useTranslations("App.PlayerCard");
  const { refetch } = authClient.useSession();
  const [data, setData] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const labels = { founder: t("founder"), played: t("played"), created: t("created") };
  const { published } = data.settings;

  return (
    <Stack spacing={2} sx={{ alignItems: "center" }}>
      <Typography component="h1" sx={visuallyHidden}>{t("title")}</Typography>
      <PlayerProfile card={visibleCard(data)} labels={labels} />
      <Stack direction="row" sx={{ justifyContent: "center", flexWrap: "wrap", gap: 1.25, maxWidth: "100%" }}>
        <Button variant="outlined" startIcon={<EditOutlined />}
          onClick={() => { setSaved(false); setEditing(true); }}>
          {t("edit")}
        </Button>
        <CardSharing key={String(saved)} />
      </Stack>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center", gap: 0.75, flexWrap: "wrap" }}>
        <Chip size="small" icon={published ? <Public /> : <LockOutlined />}
          color={published ? "success" : "default"} variant={published ? "filled" : "outlined"}
          label={published ? t("public") : t("private")} />
        {published && <CardLinkDialog username={data.settings.username} />}
      </Stack>
      {saved && <Alert severity="success">{t("saved")}</Alert>}
      {editing && <ProfileForm data={data} labels={labels} onCancel={() => setEditing(false)} onSave={(updated) => {
        if (updated.settings.name !== data.settings.name) void refetch();
        setData(updated);
        setSaved(true);
        setEditing(false);
      }} />}
    </Stack>
  );
}
