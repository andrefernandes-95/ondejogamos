import { Match } from "@/app/models/match";
import { useEffect, useState } from "react";

export function useListMatchesForArea(area: string): Match[] {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
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

    fetchData();
  }, [area]);

  return matches;
}
