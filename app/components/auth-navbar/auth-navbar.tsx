"use client";

import LanguageSettings from "@/app/components/language-settings/language-settings";
import { authClient } from "@/app/lib/auth-client";
import { AppRoutes } from "@/app/utils/routes";
import { ExitToApp, GroupAdd } from "@mui/icons-material";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AuthNavbar() {
  const { data: session, isPending, error } = authClient.useSession();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const t = useTranslations("Navbar");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setLogoutError("");

    try {
      const result = await authClient.signOut();
      if (result.error) {
        setLogoutError(t("error"));
        return;
      }

      window.location.reload();
    } catch {
      setLogoutError(t("error"));
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <Container>
        <CircularProgress />
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
          {t("hello")}, {session.user.name}
        </Typography>

        <Button
          onClick={handleSignOut}
          loading={isSigningOut}
          disabled={isSigningOut}
          variant="text"
          color="inherit"
        >
          {t("Exit")}
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
        <Typography sx={{ color: "white" }}>{t('login')}</Typography>
      </Button>
      <Button
        sx={{ gap: 1 }}
        component="a"
        href={AppRoutes.SIGN_UP}
        color="inherit"
      >
        <GroupAdd />

        <Typography sx={{ color: "white" }}>{t("createAccount")}</Typography>
      </Button>
      <LanguageSettings />
    </Container>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <Stack direction="row" sx={{ alignItems: "center" }}>
    {children}
  </Stack>
);
