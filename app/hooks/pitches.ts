import { Pitch } from "@/app/services/pitches";
import { useEffect, useState } from "react";

export function useListPitchesForArea(area: string): Pitch[] {
  const [pitches, setPitches] = useState<Pitch[]>([]);

  useEffect(() => {
    const fetchPitchesForArea = async () => {
      const response = await fetch(
        `/api/pitches?area=${encodeURIComponent(area)}`,
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar campos");
      }

      const pitchesForArea = await response.json();

      setPitches(pitchesForArea);
    };
    fetchPitchesForArea();
  }, [area]);

  return pitches;
}
