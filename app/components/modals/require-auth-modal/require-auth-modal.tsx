"use client";

import { authClient } from "@/app/lib/auth-client";
import { AppRoutes } from "@/app/utils/routes";
import { AccountCircle, NoAccounts } from "@mui/icons-material";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

export default function RequireAuthModal({ open, setOpen, children }: Props) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <CircularProgress />;
  }

  if (!session) {
    return <RequireAuthModalInner open={open} setOpen={setOpen} />;
  }

  return children;
}

export function RequireAuthModalInner({
  open,
  setOpen,
}: Pick<Props, "open" | "setOpen">) {
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const goToSignIn = () => {
    handleClose();
    router.replace(AppRoutes.LOGIN);
    router.refresh();
  };

  const goToSignUp = () => {
    handleClose();
    router.replace(AppRoutes.SIGN_UP);
    router.refresh();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle
        color="primary"
        sx={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AccountCircle />
        <Typography variant="h5">Conta necessária</Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ py: 2 }}>
          <Typography>Precisas de uma conta para continuar.</Typography>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          flexDirection: {
            xs: "column-reverse",
            sm: "row",
          },
          justifyContent: "space-between",
          gap: {
            xs: 2,
            sm: 0,
          },
          p: 2,
        }}
      >
        <Button onClick={handleClose}>Cancelar</Button>
        <Stack
          sx={{
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            gap: {
              xs: 2,
              sm: 2,
            },
          }}
        >
          <Button onClick={goToSignIn} variant="contained">
            Iniciar Sessão
          </Button>
          <Button onClick={goToSignUp} variant="contained">
            Criar Conta
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
