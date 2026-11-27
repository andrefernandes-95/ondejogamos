import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ParticipateButton({
  handleAttendance,
  pending,
}: {
  handleAttendance: ({ isAttending }: { isAttending: boolean }) => void;
  pending: boolean;
}) {
  const tApp = useTranslations();
  const [open, setOpen] = useState<boolean>(false);

  const session = authClient.useSession();

  return (
    <>
      {open && <RequireAuthModal open={open} setOpen={setOpen} />}

      <Button
        variant="contained"
        startIcon={<AddRounded />}
        loading={pending || session.isPending}
        loadingPosition="start"
        sx={{ "@media (max-width: 349px)": { px: 1, fontSize: "0.82rem" } }}
        onClick={() =>
          session?.data
            ? handleAttendance({ isAttending: true })
            : setOpen(true)
        }
      >
        {tApp("App.ParticipateButton.join")}
      </Button>
    </>
  );
}
