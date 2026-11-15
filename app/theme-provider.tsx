"use client";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { brandBlue, brandBlueDark, brandBlueLight, brandGreen } from "@/app/design/brand-colors";
import "dayjs/locale/pt";

const theme = createTheme({
  palette: {
    primary: {
      main: brandBlue,
    },
    success: {
      main: brandGreen,
    },
  },
  shape: {
    borderRadius: 2,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { padding: 12, borderRadius: 12 },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 12,
          paddingInline: 12,
        },
      },
    },
  },
});

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider
      forceColorScheme="light"
      theme={{
        primaryColor: "blue",
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        defaultRadius: "md",
        colors: {
          blue: [
            brandBlueLight,
            "#DBE8FE",
            "#BED5FD",
            "#91B8FA",
            "#6095F3",
            "#3677E5",
            brandBlue,
            brandBlueDark,
            "#103E8C",
            "#103571",
          ],
        },
      }}
    >
      <DatesProvider
        settings={{
          locale: "pt",
          firstDayOfWeek: 1,
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </DatesProvider>
    </MantineProvider>
  );
}
