import { useTranslations } from "next-intl";
import CreateMatchModal from "@/app/components/modals/create-match-modal/create-match-modal";
import { FullMatch } from "@/app/models/match";
import { Edit } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
  match: FullMatch;
}

export default function EditMatch({ match }: Props) {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      <CreateMatchModal
        selectedArea={match.pitch.area!}
        open={isEditing}
        setOpen={setIsEditing}
        existingMatch={match}
      />
      <Button
        sx={{
          flexGrow: 0,
          alignSelf: "flex-start",
          gap: 1,
        }}
        onClick={() => setIsEditing(true)}
      >
        <Edit />
        <Typography variant="body1">{t("Match.edit")}</Typography>
      </Button>
    </>
  );
}
