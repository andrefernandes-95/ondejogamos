import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppThemeProvider from "@/app/theme-provider";
import Footer from "@/app/components/footer/footer";
import Navbar from "@/app/components/navbar/navbar";
import { Box } from "@mui/material";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onde jogamos?",
  description: "Combina futeboladas e faz novas amizades",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <AppThemeProvider>
            <Box
              sx={{
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Navbar />
              <Box component="main" sx={{ flex: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </AppThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
