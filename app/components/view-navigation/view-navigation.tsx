"use client";

import { brandBlueLight } from "@/app/design/brand-colors";
import { Button, Stack } from "@mui/material";
import Link from "next/link";
import type { ReactNode } from "react";

export default function ViewNavigation({ label, links }: {
  label: string;
  links: { href: string; label: string; active?: boolean; icon?: ReactNode }[];
}) {
  return (
    <Stack component="nav" aria-label={label} direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
      {links.map((link) => (
        <Button key={link.href} component={Link} href={link.href} aria-current={link.active ? "page" : undefined}
          startIcon={link.icon}
          sx={{ "& .MuiButton-startIcon": { mr: { xs: 0.5, sm: 0.75 }, ml: 0 }, whiteSpace: "nowrap", bgcolor: link.active ? brandBlueLight : undefined }}>
          {link.label}
        </Button>
      ))}
    </Stack>
  );
}
