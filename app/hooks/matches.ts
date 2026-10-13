import { useTranslations } from "next-intl";
import { FullMatch } from "@/app/models/match";
import { useEffect, useState } from "react";

export function useListMatchesForArea(area: string) {
  const t = useTranslations();
  const [matches, setMatches] = useState<FullMatch[]>([]);

  const fetchData = async () => {
    const response = await fetch(
      `/api/matches?area=${encodeURIComponent(area)}`,
    );

    if (!response.ok) {
      throw new Error(t("Common.loadMatchesError"));
    }

    const data = await response.json();

    setMatches(data);
  };

  useEffect(() => {
    (() => {
      fetchData();
    })();
  }, [area, t]);

  return { matches, refresh: fetchData };
}
