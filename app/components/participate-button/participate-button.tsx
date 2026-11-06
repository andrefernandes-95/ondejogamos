import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@mui/material";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ParticipateButton({
  handleAttendance,
}: {
  handleAttendance: ({ isAttending }: { isAttending: boolean }) => void;
}) {
  const tApp = useTranslations();
  const [open, setOpen] = useState<boolean>(false);

  const session = authClient.useSession();

  return (
    <>
      <RequireAuthModal open={open} setOpen={setOpen} />

      <Button
        variant="contained"
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
