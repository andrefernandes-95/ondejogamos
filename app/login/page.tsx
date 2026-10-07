"use client";

import AuthForm from "@/app/components/auth-form/auth-form";
import { Background } from "@/app/components/background/background";
import { Logo } from "@/app/components/logo/logo";
import { Card, Container, Stack } from "@mui/material";

export default function LoginPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Background />
      <Stack sx={{ gap: 2 }}>
        <Logo />
        <AuthForm mode="login" />
      </Stack>
    </Container>
  );
}
