import CreateMatchModal from "@/app/components/modals/create-match-modal/create-match-modal";
import type { FullMatch } from "@/app/models/match";
import { AppRoutes } from "@/app/utils/routes";
import { EventRepeat } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RepeatMatchButton({ match }: { match: FullMatch }) {
  const t = useTranslations("App.MatchDetailsPage");
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!match.pitch.area) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} startIcon={<EventRepeat />}>
        {t("repeat_match")}
      </Button>
      {open && (
        <CreateMatchModal
          open={open}
          setOpen={setOpen}
          selectedArea={match.pitch.area}
          template={match}
          onCreated={(matchId) => router.push(AppRoutes.MATCH_DETAILS(matchId))}
        />
      )}
    </>
  );
}
