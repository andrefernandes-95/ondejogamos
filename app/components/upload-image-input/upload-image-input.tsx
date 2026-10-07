import { Delete, CloudUpload } from "@mui/icons-material";
import { Stack, Typography, Button } from "@mui/material";

interface Props {
  value: File | null;
  onChange: (file: File | null) => void;
  errorMessage?: string;
}

export default function UploadImageInput({
  value,
  onChange,
  errorMessage,
}: Props) {
  return value ? (
    <Stack
      sx={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="body1">{value.name}</Typography>
      <Button onClick={() => onChange(null)}>
        <Delete />
      </Button>
    </Stack>
  ) : (
    <Button
      component="label"
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUpload />}
    >
      Carregar imagem
      <input
        type="file"
        style={{ display: "none" }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onChange(file);
          }
        }}
      />
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    </Button>
  );
}
