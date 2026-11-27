import { Typography } from "@mui/material";
import type { ReactNode } from "react";

export default function ControlLabel({ children, id, htmlFor }: {
  children: ReactNode;
  id?: string;
  htmlFor?: string;
}) {
  return (
    <Typography component={htmlFor ? "label" : "span"} id={id} htmlFor={htmlFor} variant="body2"
      sx={{ fontFamily: "var(--font-dm-sans), Arial, sans-serif", fontWeight: 750, pl: 0.5 }}>
      {children}
    </Typography>
  );
}
