"use client";

import AuthForm from "@/app/components/auth-form/auth-form";
import { Container } from "@mui/material";

export default function LoginPage() {
  return (
    <Container maxWidth="lg">
      <AuthForm mode="login" />
    </Container>
  );
}
