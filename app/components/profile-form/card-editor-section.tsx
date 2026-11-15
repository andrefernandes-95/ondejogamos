import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export default function CardEditorSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack component="section" spacing={1.5} sx={{ minWidth: 0 }}>
      <Typography component="h2" variant="subtitle2" sx={{ color: "primary.main", fontWeight: 700 }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}
