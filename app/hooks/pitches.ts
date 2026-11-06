import { Pitch } from "@/app/services/pitches";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function useListPitchesForArea(area: string) {
  const tErrors = useTranslations("ApiErrors");
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPitchesForArea = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/pitches?area=${encodeURIComponent(area)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          const code = await readApiErrorCodeFromResponse(response);
          throw new Error(tErrors(code));
        }

        const pitchesForArea: Pitch[] = await response.json();
        setPitches(pitchesForArea);
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setPitches([]);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : tErrors("INTERNAL_ERROR"),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchPitchesForArea();
    return () => controller.abort();
  }, [area, reloadKey, tErrors]);

  return {
    pitches,
    loading,
    error,
    retry: () => setReloadKey((key) => key + 1),
  };
}

export function useSuggestPitches(area: string, limit: number): Pitch[] {
  const tErrors = useTranslations("ApiErrors");
  const [pitches, setPitches] = useState<Pitch[]>([]);

  useEffect(() => {
    const fetchPitchesForArea = async () => {
      try {
        const response = await fetch(
          `/api/pitches/suggest?area=${encodeURIComponent(area)}&limit=${encodeURIComponent(limit)}`,
        );

        if (!response.ok) {
          const code = await readApiErrorCodeFromResponse(response);
          throw new Error(tErrors(code));
        }

        const pitchesForArea = await response.json();
        setPitches(pitchesForArea);
      } catch (error) {
        console.error(error);
        setPitches([]);
      }
    };
    fetchPitchesForArea();
  }, [area, limit, tErrors]);

  return pitches;
}
