import { FullMatch } from "@/app/models/match";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type MatchResult = { area: string; matches: FullMatch[]; error: string };

export function useListMatchesForArea(area: string) {
  const tErrors = useTranslations("ApiErrors");
  const [result, setResult] = useState<MatchResult>();
  const request = useRef<AbortController>(null);

  const fetchData = useCallback(() => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;

    return fetch(`/api/matches?area=${encodeURIComponent(area)}`, { signal: controller.signal })
      .then(async (response): Promise<FullMatch[]> => {
        if (!response.ok) {
          const code = await readApiErrorCodeFromResponse(response);
          throw new Error(tErrors(code));
        }
        return response.json();
      })
      .then((matches) => {
        if (!controller.signal.aborted) setResult({ area, matches, error: "" });
      }, (cause: unknown) => {
        if (controller.signal.aborted) return;
        const error = cause instanceof Error ? cause.message : tErrors("INTERNAL_ERROR");
        setResult({ area, matches: [], error });
      });
  }, [area, tErrors]);

  useEffect(() => {
    void fetchData();
    return () => request.current?.abort();
  }, [fetchData]);

  const current = result?.area === area ? result : undefined;
  return {
    matches: current?.matches ?? [],
    error: current?.error ?? "",
    loading: !current,
    refresh: fetchData,
  };
}
