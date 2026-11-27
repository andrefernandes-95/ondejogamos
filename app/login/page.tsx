import AuthForm from "@/app/components/auth-form/auth-form";
import { safeReturnTo } from "@/app/utils/auth-return";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const { returnTo } = await searchParams;

  return <AuthForm mode="login" returnTo={safeReturnTo(returnTo)} />;
}
