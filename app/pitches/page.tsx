"use client";
import PitchList from "@/app/components/pitch-list/pitch-list";
import PageContainer from "@/app/components/page-container/page-container";
import PageTitle from "@/app/components/page-title/page-title";
import { PitchFull } from "@/app/services/pitches";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { Alert, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export default function PitchesPage() {
  const tErrors = useTranslations("ApiErrors");
  const t = useTranslations("App.PitchList");
  const [data, setData] = useState<PitchFull[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, [tErrors]);

  useEffect(() => {
    (() => {
      void fetchData();
    })();
  }, [fetchData]);

  return (
    <PageContainer>
      <Stack spacing={2}>
        <PageTitle title={t("pitch_list")} />
        {error ? <Alert severity="error">{error}</Alert> : <PitchList data={data} loading={loading} />}
      </Stack>
    </PageContainer>
  );
}
