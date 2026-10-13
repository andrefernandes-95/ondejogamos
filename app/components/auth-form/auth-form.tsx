"use client";

import { useTranslations } from "next-intl";

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

import type { ValidationTranslator } from "@/app/i18n/validation";

type Mode = "login" | "signup";

interface Props {
  mode: Mode;
}

const MIN_PASSWORD_LENGTH = 10;

function createSchema(mode: Mode, t: ValidationTranslator) {
  return z
    .object({
      name: z.string().trim().max(100, t("Validation.maxCharacters", { count: 100 })),
      email: z.email(t("Validation.email")),
      password: z
        .string()
        .min(1, t("Validation.password"))
        .max(128, t("Validation.maxCharacters", { count: 128 })),
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
          message: t("Validation.name"),
        });
      }

      if (values.password.length < MIN_PASSWORD_LENGTH) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: t("Validation.passwordMin", { count: MIN_PASSWORD_LENGTH }),
        });
      }

      if (values.password !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: t("Validation.passwordMismatch"),
        });
      }
    });
}

type FormValues = z.infer<ReturnType<typeof createSchema>>;

export default function AuthForm({ mode }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const isSignup = mode === "signup";

  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createSchema(mode, t)),
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
            message: result.error.code === "USER_ALREADY_EXISTS" || result.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
              ? t("Auth.emailAlreadyUsed")
              : t("Auth.signupError"),
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
        setNotice(
          t("Auth.verifyEmailNotice"),
        );
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
          message = t("Auth.verifyEmail");
        } else if (result.error.status === 429) {
          message = t("Auth.tooManyAttempts");
        } else {
          message =
            t("Auth.loginError");
        }

        setError("root.server", { message });
        return;
      }

      goHome();
    } catch {
      setError("root.server", {
        message: t("Auth.networkError"),
      });
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" variant="h5">
              {isSignup ? t("Navbar.createAccount") : t("Navbar.login")}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {isSignup
                ? t("Auth.signupDescription")
                : t("Auth.loginDescription")}
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
                      label={t("Common.name")}
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
                    label={t("Common.email")}
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
                    label={t("Auth.password")}
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
                                  ? t("Auth.hidePassword")
                                  : t("Auth.showPassword")
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
                      label={t("Auth.confirmPassword")}
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
                {isSignup ? t("Navbar.createAccount") : t("Navbar.login")}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2">
            {isSignup ? t("Auth.alreadyAccount") : t("Auth.noAccount")} {" "}

            <Link
              component={NextLink}
              href={isSignup ? AppRoutes.LOGIN : AppRoutes.SIGN_UP}
            >
              {isSignup ? t("Navbar.login") : t("Navbar.createAccount")}
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
}
