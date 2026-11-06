"use client";
import ProfileForm from "@/app/components/profile-form/profile-form";
import { UserProfile } from "@/app/models/user-profile";
import { readApiErrorCodeFromResponse } from "@/app/utils/api-error";
import { Alert, Card, CircularProgress, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export default function ProfilePage() {
  const tErrors = useTranslations("ApiErrors");
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/profile`);

      if (!response.ok) {
        const code = await readApiErrorCodeFromResponse(response);
        throw new Error(tErrors(code));
      }

      const profile: UserProfile = await response.json();
      setData(profile);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : tErrors("INTERNAL_ERROR"));
    } finally {
      setLoading(false);
    }
  }, [tErrors]);

  useEffect(() => {
    (() => {
      void fetchData();
    })();
  }, [fetchData]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        {error && <Alert severity="error">{error}</Alert>}
        {data && <ProfileForm profile={data} />}
      </Card>
    </Container>
  );
}
