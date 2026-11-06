"use client";
import PitchList from "@/app/components/pitch-list/pitch-list";
import { PitchFull } from "@/app/services/pitches";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { Alert } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export default function PitchesPage() {
  const tErrors = useTranslations("ApiErrors");
  const [data, setData] = useState<PitchFull[]>([]);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/pitches/all`);

      if (!response.ok) {
        const code = await readApiErrorCodeFromResponse(response);
        setError(tErrors(code));
        return;
      }

      const pitches = await response.json();
      setData(pitches);
    } catch {
      setError(tErrors("INTERNAL_ERROR"));
    }
  }, [tErrors]);

  useEffect(() => {
    (() => {
      void fetchData();
    })();
  }, [fetchData]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return <PitchList data={data} />;
}
