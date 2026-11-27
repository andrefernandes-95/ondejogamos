import type { PitchWithSlots } from "@/app/services/pitch-availability";
import { readApiErrorCodeFromResponse, type ApiErrorCode } from "@/app/utils/api-error";
import { useEffect, useState } from "react";

export function usePitchSlots(area: string, day: string, duration: number) {
  const query = area && day ? new URLSearchParams({ area, day, duration: String(duration) }).toString() : "";
  const [request, setRequest] = useState(0);
  const key = `${query}:${request}`;
  const [result, setResult] = useState<{ key: string; pitches: PitchWithSlots[]; error?: ApiErrorCode }>();

  useEffect(() => {
    if (!query) {
      return;
    }
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/pitches/slots?${query}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) {
          const error = await readApiErrorCodeFromResponse(response);
          if (!controller.signal.aborted) {
            setResult({ key, pitches: [], error });
          }
          return;
        }
        const pitches: PitchWithSlots[] = await response.json();
        if (!controller.signal.aborted) {
          setResult({ key, pitches });
        }
      } catch {
        if (!controller.signal.aborted) {
          setResult({ key, pitches: [], error: "AVAILABILITY_READ_FAILED" });
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [key, query]);

  const current = result?.key === key ? result : undefined;
  return {
    pitches: current?.pitches ?? [],
    loading: Boolean(query) && !current,
    error: current?.error,
    retry: () => setRequest((value) => value + 1),
  };
}
