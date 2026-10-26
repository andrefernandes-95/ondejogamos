import { useLocale } from "next-intl";

export type Localization = "EN" | "PT";

export default function useLocalization(): Localization {
  const locale = useLocale();

  if (locale === "en") {
    return "EN";
  }

  return "PT";
}
