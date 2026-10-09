"use client";

import AuthNavbar from "@/app/components/auth-navbar/auth-navbar";
import { Logo } from "@/app/components/logo/logo";
import { Box, Container, Divider, Stack } from "@mui/material";

export default function Navbar() {
  return (
    <>
      <Box
        component="nav"
        sx={(theme) => ({
          background: theme.palette.primary.main,
          color: theme.palette.common.white,
        })}
      >
        <Container maxWidth="lg">
          <Stack
            sx={{
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: {
                xs: "center",
              },
              pt: {
                xs: 2,
                sm: 0,
              },
              justifyContent: {
                xs: "center",
                sm: "space-between",
              },
            }}
          >
            <Logo />
            <AuthNavbar />
          </Stack>
        </Container>
      </Box>
    </>
  );
}
