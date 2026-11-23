import AuthForm from "@/app/components/auth-form/auth-form";
import { safeReturnTo } from "@/app/utils/auth-return";
import { Container } from "@mui/material";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const { returnTo } = await searchParams;

  return (
    <Container maxWidth="lg">
      <AuthForm mode="signup" returnTo={safeReturnTo(returnTo)} />
    </Container>
  );
}
