import useLocalization from "@/app/hooks/locale";
import { FullMatch } from "@/app/models/match";
import { useCallback, useEffect, useState } from "react";

export function useListMatchesForArea(area: string) {
  const [matches, setMatches] = useState<FullMatch[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEn = useLocalization() === "EN";

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setHasFetched(true);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/matches?area=${encodeURIComponent(area)}`,
        { signal },
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar jogos");
      }

      const data = await response.json();

      if (!signal?.aborted) {
        setMatches(data);
      }
    } catch (e) {
      if (signal?.aborted) {
        return;
      }

      if (typeof e === "string") {
        setError(e);
      } else {
        setError(isEn ? "Something went wrong" : "Ocorreu um erro");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [area, isEn]);

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData(controller.signal);

    return () => controller.abort();
  }, [fetchData]);

  return { matches, refresh: fetchData, loading, error, hasFetched };
}
