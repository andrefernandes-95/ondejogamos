"use client";

import AuthForm from "@/app/components/auth-form/auth-form";
import { Container } from "@mui/material";

export default function SignupPage() {
  return (
    <Container maxWidth="lg">
      <AuthForm mode="signup" />
    </Container>
  );
}
