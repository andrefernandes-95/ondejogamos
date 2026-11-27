"use client";

import { alpha, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ExpandMoreRounded } from "@mui/icons-material";
import { brandBlue, brandBlueDark, brandBlueLight, brandGreen } from "@/app/design/brand-colors";
import "dayjs/locale/pt";

const controlFont = "var(--font-dm-sans), Arial, sans-serif";

const theme = createTheme({
  palette: {
    text: { primary: "#112245", secondary: "#526482" },
    background: { default: "#fff", paper: "#fff" },
    divider: "#dce5f1",
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
      fontFamily: controlFont,
      fontSize: "0.95rem",
      textTransform: "none",
      fontWeight: 750,
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
        root: {
          borderRadius: 12,
          fontFamily: controlFont,
          fontWeight: 700,
          "&.Mui-selected": {
            color: brandBlueDark,
            backgroundColor: brandBlueLight,
          },
          "&.Mui-selected:hover": { backgroundColor: alpha(brandBlue, 0.14) },
          "&.Mui-focusVisible": { outline: `2px solid ${brandBlue}`, outlineOffset: 2, zIndex: 1 },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          padding: 4, gap: 4, border: `1px solid ${alpha(brandBlue, 0.14)}`,
          backgroundColor: brandBlueLight, borderRadius: 15,
          "&& .MuiToggleButtonGroup-grouped": {
            margin: 0, border: 0, borderRadius: 10, minHeight: 44, minWidth: 61, paddingInline: 12,
            color: brandBlueDark, fontSize: "0.95rem", fontWeight: 800,
            "&.Mui-selected": {
              color: "#fff", backgroundColor: brandBlue,
              boxShadow: `inset 0 1px 0 #ffffff36, 0 2px 6px ${alpha(brandBlueDark, 0.22)}`,
              "&:hover": { backgroundColor: brandBlueDark },
            },
          },
        },
      },
    },
    MuiSelect: { defaultProps: { IconComponent: ExpandMoreRounded } },
    MuiNativeSelect: { defaultProps: { IconComponent: ExpandMoreRounded } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: controlFont, fontSize: "1rem", fontWeight: 550,
          minHeight: 54, borderRadius: 14, backgroundColor: alpha(theme.palette.primary.main, 0.022),
          "&.MuiInputBase-sizeSmall": { minHeight: 48 },
          "&:not(.Mui-error):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline": { borderColor: "#ccd8eb" },
          "&:not(.Mui-error):not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.primary.main, 0.55),
          },
          "&.Mui-focused:not(.Mui-error)": {
            backgroundColor: theme.palette.common.white,
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.11)}`,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
          },
          "@media (prefers-reduced-motion: no-preference)": {
            transition: theme.transitions.create(["background-color", "box-shadow"], { duration: 150 }),
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontFamily: controlFont, fontWeight: 650 },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { fontFamily: controlFont },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 44, borderRadius: 13, paddingInline: 15, lineHeight: 1.2,
          "&.Mui-focusVisible": { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 3 },
          "&.MuiButton-outlinedPrimary:not(.Mui-disabled)": {
            borderColor: alpha(theme.palette.primary.main, 0.25),
            backgroundColor: alpha(theme.palette.primary.main, 0.025),
            "&:hover": {
              borderColor: alpha(theme.palette.primary.main, 0.6),
              backgroundColor: alpha(theme.palette.primary.main, 0.07),
            },
          },
          "&.MuiButton-containedPrimary:not(.Mui-disabled)": {
            backgroundImage: `linear-gradient(145deg, #2868e4, ${theme.palette.primary.main} 40%, #1641ad)`,
            boxShadow: `inset 0 1px 0 #ffffff35, 0 2px 0 #13378e, 0 6px 14px ${alpha(theme.palette.primary.dark, 0.28)}`,
            "&:hover": { boxShadow: `inset 0 1px 0 #ffffff50, 0 2px 0 #13378e, 0 9px 18px ${alpha(theme.palette.primary.dark, 0.33)}` },
            "&:active": { boxShadow: `inset 0 2px 5px #12337955, 0 3px 7px ${alpha(theme.palette.primary.dark, 0.22)}` },
          },
          "&.MuiButton-sizeLarge": { minHeight: 54, paddingInline: 20 },
          "@media (prefers-reduced-motion: no-preference) and (hover: hover)": {
            transition: theme.transitions.create(["background-color", "box-shadow", "border-color", "transform"], { duration: 150 }),
            "&.MuiButton-containedPrimary:not(.Mui-disabled):hover": { transform: "translateY(-1px)" },
            "&.MuiButton-containedPrimary:not(.Mui-disabled):active": { transform: "translateY(1px)" },
          },
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }),
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
