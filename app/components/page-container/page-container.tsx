import { Container } from "@mui/material";
import type { ReactNode } from "react";

export default function PageContainer({ children, maxWidth = "lg" }: {
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg";
}) {
  return (
    <Container maxWidth={maxWidth} sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, md: 4 } }}>
      {children}
    </Container>
  );
}
