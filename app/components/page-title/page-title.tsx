import { ChevronLeft } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export default function PageTitle({ title, description, back, compact }: {
  title: ReactNode;
  description?: string;
  back?: { href: string; label: string };
  compact?: boolean;
}) {
  return (
    <Stack spacing={1}>
      {back && (
        <Button href={back.href} startIcon={<ChevronLeft />} sx={{ alignSelf: "flex-start" }}>
          {back.label}
        </Button>
      )}
      <Typography component="h1" sx={{
        color: "text.primary", fontWeight: 850, lineHeight: 1.08, letterSpacing: "-.045em", overflowWrap: "anywhere",
        fontSize: compact ? { xs: "1.85rem", md: "2.25rem" } : { xs: "2.2rem", md: "3.1rem" },
      }}>
        {title}
      </Typography>
      {description && <Typography color="text.secondary">{description}</Typography>}
    </Stack>
  );
}
