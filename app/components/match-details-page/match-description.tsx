import { Divider, Stack, Typography } from "@mui/material";

type Props = {
  description: string | null | undefined;
  title: string;
};

export default function MatchDescription({ description, title }: Props) {
  const text = description?.trim();
  if (!text) return null;

  return (
    <>
      <Divider />
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {text}
        </Typography>
      </Stack>
    </>
  );
}
