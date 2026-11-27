"use client";

import { authClient } from "@/app/lib/auth-client";
import { AppRoutes } from "@/app/utils/routes";
import { AccountCircleOutlined, LoginRounded, LogoutRounded, PersonAddAltRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
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
        setLogoutError(tApp("App.AuthNavbar.error"));
        return;
      }

      window.location.reload();
    } catch {
      setLogoutError(tApp("App.AuthNavbar.error"));
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
    const profile = tApp("App.AuthNavbar.profile");
    const exit = tApp("App.AuthNavbar.exit");
    return (
      <Container>
        <Button href={AppRoutes.PROFILE} color="inherit" aria-label={profile} sx={accountActionSx}>
          <AccountCircleOutlined fontSize="small" />
          <Box component="span" sx={signedInLabelSx}>{profile}</Box>
        </Button>
        <Button
          onClick={handleSignOut}
          loading={isSigningOut}
          disabled={isSigningOut}
          variant="text"
          color="inherit"
          aria-label={exit}
          sx={accountActionSx}
        >
          <LogoutRounded fontSize="small" />
          <Box component="span" sx={signedInLabelSx}>{exit}</Box>
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
      {[
        { href: AppRoutes.LOGIN, label: tApp("App.HomeSchedule.sign_in"), Icon: LoginRounded },
        { href: AppRoutes.SIGN_UP, label: tApp("App.AuthNavbar.create_account"), Icon: PersonAddAltRounded },
      ].map(({ href, label, Icon }) => (
        <Button key={href} href={href} color="inherit" aria-label={label}
          sx={accountActionSx}>
          <Icon fontSize="small" />
          <Box component="span" sx={accountLabelSx}>{label}</Box>
        </Button>
      ))}
    </Container>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <Stack direction="row" sx={{ alignItems: "center" }}>
    {children}
  </Stack>
);

const accountActionSx = { gap: 0.75, minWidth: 44, px: { xs: 1, sm: 1.5 }, whiteSpace: "nowrap" };
const accountLabelSx = { display: { xs: "none", sm: "inline" } };
const signedInLabelSx = { "@media (max-width: 354px)": { display: "none" } };
