"use client";

import { authClient } from "@/app/lib/auth-client";
import { AppRoutes } from "@/app/utils/routes";
import { Button, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthNavbar() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setLogoutError("");

    try {
      const result = await authClient.signOut();
      if (result.error) {
        setLogoutError("Não foi possível terminar a sessão");
        return;
      }

      router.refresh();
    } catch {
      setLogoutError("Não foi possível contactar o servidor");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <Container>
        <Typography color="textSecondary">A carregar...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="alert" role="alert">
          Não foi possível verificar a sessão .
        </Typography>
      </Container>
    );
  }

  if (session) {
    return (
      <Container>
        <Typography align="center">Olá, {session.user.name}</Typography>

        <Button
          onClick={handleSignOut}
          loading={isSigningOut}
          disabled={isSigningOut}
        >
          Sair
        </Button>

        {logoutError && (
          <Typography role="alert" color="error">
            {logoutError}
          </Typography>
        )}
      </Container>
    );
  }

  return (
    <Container>
      <Link component={NextLink} href={AppRoutes.LOGIN}>
        <Typography>Iniciar sessão</Typography>
      </Link>
      <Link component={NextLink} href={AppRoutes.SIGN_UP}>
        <Typography>Criar conta</Typography>
      </Link>
    </Container>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <Stack direction="row" sx={{ gap: 2, py: 2, alignItems: "center" }}>
    {children}
  </Stack>
);
