"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LanguageDetector() {
  const locale = useLocale();
  const router = useRouter();

  const getLocaleCookie = () =>
    document.cookie
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("locale="))
      ?.slice("locale=".length);

  useEffect(() => {
    const saved = getLocaleCookie();
    if (saved === "pt-PT" || saved === "en") {
      // Respect existing choice
      return;
    }

    const languages = navigator.languages.length
      ? navigator.languages
      : [navigator.language];

    const preferred = languages
      .map((lang) => lang.toLowerCase().split("-")[0])
      .find((lang) => lang === "pt" || lang === "en");

    const nextLocale = preferred === "en" ? "en" : "pt-PT";
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `locale=${nextLocale}; Path=/; Max-Age=35136000; SameSite=Lax${secure}`;

    // Only refresh if cookie got saved and language has changed
    if (getLocaleCookie() === nextLocale && locale !== nextLocale) {
      router.refresh();
    }
  }, [router, locale]);

  return null;
}
