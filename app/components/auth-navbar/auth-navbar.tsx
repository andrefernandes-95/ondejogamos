"use client";

import { authClient } from "@/app/lib/auth-client";
import { AppRoutes } from "@/app/utils/routes";
import { ExitToApp, GroupAdd } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function AuthNavbar() {
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

      window.location.reload();
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
        <Typography align="center" sx={{ color: "white" }}>
          Olá, {session.user.name}
        </Typography>

        <Button
          onClick={handleSignOut}
          loading={isSigningOut}
          disabled={isSigningOut}
          variant="text"
          color="inherit"
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
      <Button
        component="a"
        href={AppRoutes.LOGIN}
        color="inherit"
        sx={{ gap: 1 }}
      >
        <ExitToApp />
        <Typography sx={{ color: "white" }}>Iniciar sessão</Typography>
      </Button>
      <Button
        sx={{ gap: 1 }}
        component="a"
        href={AppRoutes.SIGN_UP}
        color="inherit"
      >
        <GroupAdd />

        <Typography sx={{ color: "white" }}>Criar conta</Typography>
      </Button>
    </Container>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <Stack direction="row" sx={{ gap: 2, py: 2, alignItems: "center" }}>
    {children}
  </Stack>
);
