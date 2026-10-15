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
import LanguageDetector from "@/app/components/language-detector/language-detector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ondejogamos.com"),
  title: "Onde jogamos | Encontra e Organiza Futeboladas em Portugal",
  description:
    "Queres jogar futebol? Encontra futeboladas perto de ti, junta-te a outros jogadores ou organiza os teus próprios jogos. Joga futebol em Portugal!",
  openGraph: {
    title: "Onde Jogamos ⚽ | Nunca mais fiques sem futebolada!",
    description:
      "Encontra jogos de futebol perto de ti, conhece novos jogadores e organiza futeboladas em Portugal.",
    url: "https://ondejogamos.com",
    siteName: "Onde Jogamos",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Onde Jogamos - A tua próxima futebolada começa aqui",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Onde Jogamos ⚽ | Encontra Futeboladas em Portugal",
    description:
      "Encontra e organiza jogos de futebol perto de ti. Junta-te à comunidade!",
    images: ["/og-image.png"],
  },
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
          <LanguageDetector />
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
