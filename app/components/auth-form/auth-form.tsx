"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/app/lib/auth-client";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import NextLink from "next/link";
import { AppRoutes } from "@/app/utils/routes";
import useLocalization from "@/app/hooks/locale";

type Mode = "login" | "signup";

interface Props {
  mode: Mode;
}

const MIN_PASSWORD_LENGTH = 10;

function createSchema(mode: Mode, isEn: boolean) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .max(100, isEn ? `Max 100 characters` : "Máximo de 100 caracteres"),
      email: z.email(isEn ? "Invalid email" : "Introduz um e-mail válido"),
      password: z
        .string()
        .min(1, isEn ? "Invalid password" : "Introduz uma password")
        .max(128, isEn ? "Max 128 characters" : "Máximo de 128 caracteres"),
      confirmPassword: z.string(),
    })
    .superRefine((values, ctx) => {
      if (mode !== "signup") {
        return;
      }

      if (!values.name) {
        ctx.addIssue({
          code: "custom",
          path: ["name"],
          message: isEn ? "Insert a name" : "Introduz o teu nome",
        });
      }

      if (values.password.length < MIN_PASSWORD_LENGTH) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: isEn
            ? `Use at least ${MIN_PASSWORD_LENGTH} characters`
            : `Usa pelo menos ${MIN_PASSWORD_LENGTH} caracteres`,
        });
      }

      if (values.password !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: isEn
            ? "Passwords do not match"
            : `As passwords não coincidem`,
        });
      }
    });
}

type FormValues = z.infer<ReturnType<typeof createSchema>>;

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const isEn = useLocalization() === "EN";
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createSchema(mode, isEn)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const goHome = () => {
    router.replace(AppRoutes.HOME);
    router.refresh();
  };

  const onSubmit = async (values: FormValues) => {
    clearErrors("root");
    setNotice("");

    try {
      if (isSignup) {
        const result = await authClient.signUp.email({
          name: values.name,
          email: values.email,
          password: values.password,
          callbackURL: "/",
        });

        if (result.error) {
          setError("root.server", {
            message:
              result.error.message ||
              (isEn
                ? "Could not create account"
                : "Não foi possível criar a conta"),
          });
          return;
        }

        resetField("password");
        resetField("confirmPassword");

        // With autoSignIn, registration also creates a session
        if (result?.data?.token) {
          goHome();
          return;
        }

        // Without session - verify email flow
        return;
      }

      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: true,
      });

      if (result.error) {
        let message = "";
        if (result.error.code === "EMAIL_NOT_VERIFIED") {
          message = isEn
            ? "Confirm your e-mail"
            : "Confirma o teu e-mail antes de iniciar sessão.";
        } else if (result.error.status === 429) {
          message = isEn
            ? "Too many attempts. Try again later."
            : "Demasiadas tentativas. Tenta novamente daqui a pouco.";
        } else {
          message = isEn
            ? "Could not sign in. Please try again."
            : "Não foi possível entrar. Verifica os dados e tenta novamente.";
        }

        setError("root.server", { message });
        return;
      }

      goHome();
    } catch {
      setError("root.server", {
        message: isEn
          ? "Something went wrong!"
          : "Não foi possível contactar o servidor. Tenta novamente.",
      });
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" variant="h5">
              {isSignup
                ? isEn
                  ? "Sign Up"
                  : "Criar conta"
                : isEn
                  ? "Sign In"
                  : "Entrar"}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {isSignup
                ? isEn
                  ? "Create an account to organize and participate in games"
                  : "Cria uma conta para organizar e participar em jogos"
                : isEn
                  ? "Sign in to your account"
                  : "Entra na tua conta para continuar"}
            </Typography>
          </Box>

          {errors.root?.server?.message && (
            <Alert severity="error">{errors.root.server.message}</Alert>
          )}

          {notice && (
            <Alert severity="success" role="status">
              {notice}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {isSignup && (
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      label={isEn ? "Name" : "Nome"}
                      autoComplete="name"
                      required
                      fullWidth
                      disabled={isSubmitting}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    label="Email"
                    type="email"
                    autoComplete="email"
                    required
                    fullWidth
                    disabled={isSubmitting}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isSignup ? "new-password" : "current-password"
                    }
                    required
                    fullWidth
                    disabled={isSubmitting}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              edge="end"
                              disabled={isSubmitting}
                              aria-label={
                                showPassword
                                  ? isEn
                                    ? "Hide password"
                                    : "Ocultar password"
                                  : isEn
                                    ? "Show password"
                                    : "Mostrar password"
                              }
                              aria-pressed={showPassword}
                              onClick={() => setShowPassword((value) => !value)}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />

              {isSignup && (
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      label={isEn ? "Confirm password" : "Confirmar password"}
                      type={showPassword ? "text" : "password"}
                      autoComplete={"new-password"}
                      required
                      fullWidth
                      disabled={isSubmitting}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSignup
                  ? isEn
                    ? "Create account"
                    : "Criar conta"
                  : isEn
                    ? "Sign In"
                    : "Entrar"}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2">
            {isSignup
              ? isEn
                ? "Already have an account? "
                : "Já tens conta? "
              : isEn
                ? "No account yet? "
                : "Ainda não tens conta? "}

            <Link
              component={NextLink}
              href={isSignup ? AppRoutes.LOGIN : AppRoutes.SIGN_UP}
            >
              {isSignup
                ? isEn
                  ? "Sign In"
                  : "Entrar"
                : isEn
                  ? "Create account"
                  : "Criar conta"}
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
}
