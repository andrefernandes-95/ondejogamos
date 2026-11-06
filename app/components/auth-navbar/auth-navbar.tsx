"use client";

import { authClient } from "@/app/lib/auth-client";
import { AppRoutes } from "@/app/utils/routes";
import { ExitToApp, GroupAdd } from "@mui/icons-material";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function AuthNavbar() {
  const tApp = useTranslations();
  const { data: session, isPending, error } = authClient.useSession();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setLogoutError("");

    try {
      const result = await authClient.signOut();
      if (result.error) {
        setLogoutError(
          tApp("App.AuthNavbar.error"),
        );
        return;
      }

      window.location.reload();
    } catch {
      setLogoutError(
        tApp("App.AuthNavbar.error"),
      );
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
          {tApp("App.AuthNavbar.error")}
        </Typography>
      </Container>
    );
  }

  if (session) {
    return (
      <Container>
        <Typography align="center" sx={{ color: "white", mr: 1 }}>
          {tApp("App.AuthNavbar.greeting")}, {session.user.name}
        </Typography>

        {/* <Button
          onClick={handleSignOut}
          loading={isSigningOut}
          disabled={isSigningOut}
          variant="text"
          color="inherit"
        >
          {tApp("App.AuthNavbar.profile")}
        </Button> */}
        <Button
          onClick={handleSignOut}
          loading={isSigningOut}
          disabled={isSigningOut}
          variant="text"
          color="inherit"
        >
          {tApp("App.AuthNavbar.exit")}
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
        <Typography sx={{ color: "white" }}>
          {tApp("App.AuthNavbar.login")}
        </Typography>
      </Button>
      <Button
        sx={{ gap: 1 }}
        component="a"
        href={AppRoutes.SIGN_UP}
        color="inherit"
      >
        <GroupAdd />

        <Typography sx={{ color: "white" }}>
          {tApp("App.AuthNavbar.create_account")}
        </Typography>
      </Button>
    </Container>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <Stack direction="row" sx={{ alignItems: "center" }}>
    {children}
  </Stack>
);
