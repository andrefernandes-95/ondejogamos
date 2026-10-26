import useLocalization from "@/app/hooks/locale";
import { PitchFull } from "@/app/services/pitches";
import { AppRoutes } from "@/app/utils/routes";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  pitch: PitchFull;
}

export default function DeletePitch({ pitch }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const router = useRouter();

  const isEn = useLocalization() === "EN";

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
          isEn ? "Could not remove pitch" : "Não foi possível remover o campo",
        );
        return;
      }

      window.location.reload();
    } catch {
      setServerError(isEn ? "An error occurred" : `Ocorreu um erro`);
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
            {isEn
              ? "Are you sure you want to remove this pitch?"
              : "Desejas remover este campo?"}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ py: 2 }}>
            {serverError ? (
              <Alert severity="error">{serverError}</Alert>
            ) : (
              <Typography>
                {isEn
                  ? "This action is irreversible"
                  : "Esta acção é irreversível"}
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
            {isEn ? "Cancel" : "Cancelar"}
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
              {isEn ? "Remove Pitch" : "Remover Campo"}
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
          {isEn ? "Remove Pitch" : "Remover Campo"}
        </Typography>
      </Button>
    </>
  );
}
