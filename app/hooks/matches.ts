import { FullMatch } from "@/app/models/match";
import { useEffect, useState } from "react";

export function useListMatchesForArea(area: string) {
  const [matches, setMatches] = useState<FullMatch[]>([]);

  const fetchData = async () => {
    const response = await fetch(
      `/api/matches?area=${encodeURIComponent(area)}`,
    );

    if (!response.ok) {
      throw new Error("Falha ao carregar jogos");
    }

    const data = await response.json();
    setMatches(data);
  };

  useEffect(() => {
    (() => {
      fetchData();
    })();
  }, [area]);

  return { matches, refresh: fetchData };
}
