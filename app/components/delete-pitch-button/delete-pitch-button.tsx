import { PitchFull } from "@/app/services/pitches";
import { Cancel } from "@mui/icons-material";
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
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  pitch: PitchFull;
}

export default function DeletePitch({ pitch }: Props) {
  const tApp = useTranslations();
  const [confirm, setConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleDelete = async () => {
    setServerError("");

    try {
      const body = new FormData();
      body.append("id", pitch.id.toString());

      const response = await fetch(`/api/pitches`, {
        method: "DELETE",
        body,
      });

      if (!response.ok) {
        setServerError(
          tApp("App.DeletePitchButton.could_not_remove_pitch"),
        );
        return;
      }

      window.location.reload();
    } catch {
      setServerError(tApp("App.DeletePitchButton.an_error_occurred"));
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
          <Typography variant="h5">
            {tApp("App.DeletePitchButton.are_you_sure_you_want_to_remove_this_pitch")}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ py: 2 }}>
            {serverError ? (
              <Alert severity="error">{serverError}</Alert>
            ) : (
              <Typography>
                {tApp("App.DeletePitchButton.this_action_is_irreversible")}
              </Typography>
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
            {tApp("App.DeletePitchButton.cancel")}
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
            <Button color="error" onClick={handleDelete} variant="contained">
              {tApp("App.DeletePitchButton.remove_pitch")}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <Button
        color="error"
        size="small"
        sx={{
          flexGrow: 0,
          alignSelf: "flex-start",
          gap: 1,
        }}
        onClick={() => setConfirm(true)}
      >
        <Cancel sx={{ fontSize: 18 }} />
        <Typography variant="button">
          {tApp("App.DeletePitchButton.remove_pitch")}
        </Typography>
      </Button>
    </>
  );
}
