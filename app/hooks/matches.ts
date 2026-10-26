import useLocalization from "@/app/hooks/locale";
import { FullMatch } from "@/app/models/match";
import { useEffect, useState } from "react";

export function useListMatchesForArea(area: string) {
  const [matches, setMatches] = useState<FullMatch[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEn = useLocalization() === "EN";

  const fetchData = async () => {
    setHasFetched(true);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/matches?area=${encodeURIComponent(area)}`,
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar jogos");
      }

      const data = await response.json();

      setMatches(data);
    } catch (e) {
      console.error(e);

      if (typeof e === "string") {
        setError(e);
      } else {
        setError(isEn ? "Something went wrong" : "Ocorreu um erro");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (() => {
      fetchData();
    })();
  }, [area]);

  return { matches, refresh: fetchData, loading, error, hasFetched };
}
