"use client";

import AuthForm from "@/app/components/auth-form/auth-form";
import { Background } from "@/app/components/background/background";
import { Logo } from "@/app/components/logo/logo";
import { Container, Stack } from "@mui/material";

export default function SignupPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Background />
      <Stack sx={{ gap: 2 }}>
        <Logo />
        <AuthForm mode="signup" />
      </Stack>
    </Container>
  );
}
