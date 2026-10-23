import { Pitch } from "@/app/services/pitches";
import { useEffect, useState } from "react";

export function useListPitchesForArea(area: string) {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPitchesForArea = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `/api/pitches?area=${encodeURIComponent(area)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to load pitches");
        }

        const pitchesForArea: Pitch[] = await response.json();
        setPitches(pitchesForArea);
      } catch {
        if (!controller.signal.aborted) {
          setPitches([]);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchPitchesForArea();
    return () => controller.abort();
  }, [area, reloadKey]);

  return {
    pitches,
    loading,
    error,
    retry: () => setReloadKey((key) => key + 1),
  };
}

export function useSuggestPitches(area: string, limit: number): Pitch[] {
  const [pitches, setPitches] = useState<Pitch[]>([]);

  useEffect(() => {
    const fetchPitchesForArea = async () => {
      const response = await fetch(
        `/api/pitches/suggest?area=${encodeURIComponent(area)}&limit=${encodeURIComponent(limit)}`,
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar campos");
      }

      const pitchesForArea = await response.json();

      setPitches(pitchesForArea);
    };
    fetchPitchesForArea();
  }, [area, limit]);

  return pitches;
}
