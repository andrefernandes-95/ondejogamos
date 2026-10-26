import RequireAuthModal from "@/app/components/modals/require-auth-modal/require-auth-modal";
import useLocalization from "@/app/hooks/locale";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@mui/material";
import { useState } from "react";

export default function ParticipateButton({
  handleAttendance,
}: {
  handleAttendance: ({ isAttending }: { isAttending: boolean }) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const session = authClient.useSession();

  const isEn = useLocalization() === "EN";

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
        {isEn ? "Join" : "Participar"}
      </Button>
    </>
  );
}
