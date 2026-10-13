import { useTranslations } from "next-intl";
import { FullMatch } from "@/app/models/match";
import { AppRoutes } from "@/app/utils/routes";
import { AccountCircle, Cancel, SportsSoccer } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  match: FullMatch;
}

export default function DeleteMatch({ match }: Props) {
  const t = useTranslations();
  const [confirm, setConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const router = useRouter();

  const deleteMatch = async () => {
    setServerError("");

    try {
      const body = new FormData();
      body.append("id", match.id);

      const response = await fetch(`/api/matches`, {
        method: "DELETE",
        body,
      });

      if (!response.ok) {
        setServerError(t("Match.cancelError"));
        return;
      }

      router.replace(AppRoutes.HOME);
      router.refresh();
    } catch {
      setServerError(t("Common.error"));
    }
  };

  return (
    <>
      <Dialog open={confirm} onClose={() => setConfirm(false)} fullWidth>
        <DialogTitle
          color="error"
          sx={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h5">{t("Match.confirmCancellation")}</Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ py: 2 }}>
            {serverError ? (
              <Alert severity="error">{serverError}</Alert>
            ) : (
              <Typography>{t("Match.irreversible")}</Typography>
            )}
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
          <Button color="error" onClick={() => setConfirm(false)}>
            {t("Common.cancel")}
          </Button>
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
            <Button color="error" onClick={deleteMatch} variant="contained">
              {t("Match.cancelMatch")}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <Button
        color="error"
        sx={{
          flexGrow: 0,
          alignSelf: "flex-start",
          gap: 1,
        }}
        onClick={() => setConfirm(true)}
      >
        <Cancel />
        <Typography variant="body1">{t("Match.cancelMatch")}</Typography>
      </Button>
    </>
  );
}
