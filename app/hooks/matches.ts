import { FullMatch } from "@/app/models/match";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function useListMatchesForArea(area: string) {
  const tErrors = useTranslations("ApiErrors");
  const [matches, setMatches] = useState<FullMatch[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setHasFetched(true);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/matches?area=${encodeURIComponent(area)}`,
      );

      if (!response.ok) {
        const code = await readApiErrorCodeFromResponse(response);
        throw new Error(tErrors(code));
      }

      const data = await response.json();

      setMatches(data);
    } catch (e) {
      console.error(e);

      setError(e instanceof Error ? e.message : tErrors("INTERNAL_ERROR"));
    } finally {
      setLoading(false);
    }
  }, [area, tErrors]);

  useEffect(() => {
    (() => {
      void fetchData();
    })();
  }, [fetchData]);

  return { matches, refresh: fetchData, loading, error, hasFetched };
}
