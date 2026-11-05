"use client";
import ProfileForm from "@/app/components/profile-form/profile-form";
import useLocalization from "@/app/hooks/locale";
import { UserProfile } from "@/app/models/user-profile";
import { getErrorMessage } from "@/app/utils/error";
import { Card, CircularProgress, Container } from "@mui/material";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [data, setData] = useState<UserProfile | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const isEn = useLocalization() === "EN";

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/profile`);

      if (!response.ok) {
        throw new Error("Falha ao carregar jogos");
      }

      const data = await response.json();
      setData(data);
    } catch (e) {
      console.error(e);

      if (typeof e === "string") {
        setError(getErrorMessage(e, isEn));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (() => {
      fetchData();
    })();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        <ProfileForm profile={data!} />
      </Card>
    </Container>
  );
}
