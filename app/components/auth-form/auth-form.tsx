"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/app/lib/auth-client";
import PageContainer from "@/app/components/page-container/page-container";
import PageTitle from "@/app/components/page-title/page-title";
import {
  Alert,
  Box,
  Button,
  Card,
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
import { authUrl, safeReturnTo } from "@/app/utils/auth-return";
import { useTranslations } from "next-intl";

type Mode = "login" | "signup";

interface Props {
  mode: Mode;
  returnTo: string;
}

const MIN_PASSWORD_LENGTH = 10;

function createSchema(
  mode: Mode,
  messages: {
    maxName: string;
    invalidEmail: string;
    invalidPassword: string;
    maxPassword: string;
    insertName: string;
    minPassword: (count: number) => string;
    passwordsMismatch: string;
  },
) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .max(100, messages.maxName),
      email: z.email(messages.invalidEmail),
      password: z
        .string()
        .min(1, messages.invalidPassword)
        .max(128, messages.maxPassword),
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
          message: messages.insertName,
        });
      }

      if (values.password.length < MIN_PASSWORD_LENGTH) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: messages.minPassword(MIN_PASSWORD_LENGTH),
        });
      }

      if (values.password !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: messages.passwordsMismatch,
        });
      }
    });
}

type FormValues = z.infer<ReturnType<typeof createSchema>>;

export default function AuthForm({ mode, returnTo }: Props) {
  const tApp = useTranslations();
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
    resolver: zodResolver(
      createSchema(mode, {
        maxName: tApp("App.AuthForm.max_100_characters"),
        invalidEmail: tApp("App.AuthForm.invalid_email"),
        invalidPassword: tApp("App.AuthForm.invalid_password"),
        maxPassword: tApp("App.AuthForm.max_128_characters"),
        insertName: tApp("App.AuthForm.insert_a_name"),
        minPassword: (count) => tApp("App.AuthForm.minimum_password_length", { count }),
        passwordsMismatch: tApp("App.AuthForm.passwords_do_not_match"),
      }),
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const destination = safeReturnTo(returnTo);
  const goToDestination = () => {
    router.replace(destination);
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
          callbackURL: destination,
        });

        if (result.error) {
          setError("root.server", {
            message:
              result.error.message ||
              (tApp("App.AuthForm.could_not_create_account")),
          });
          return;
        }

        resetField("password");
        resetField("confirmPassword");

        // With autoSignIn, registration also creates a session
        if (result?.data?.token) {
          goToDestination();
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
          message = tApp("App.AuthForm.confirm_your_e_mail");
        } else if (result.error.status === 429) {
          message = tApp("App.AuthForm.too_many_attempts_try_again_later");
        } else {
          message = tApp("App.AuthForm.could_not_sign_in_please_try_again");
        }

        setError("root.server", { message });
        return;
      }

      goToDestination();
    } catch {
      setError("root.server", {
        message: tApp("App.AuthForm.something_went_wrong"),
      });
    }
  };

  return (
    <PageContainer maxWidth="xs">
      <Card variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <PageTitle compact
            title={tApp(isSignup ? "App.AuthForm.sign_up" : "App.AuthForm.sign_in")}
            description={tApp(isSignup
              ? "App.AuthForm.create_an_account_to_organize_and_participate_in_games"
              : "App.AuthForm.sign_in_to_your_account")} />

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
                      label={tApp("App.AuthForm.name")}
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
                    label={tApp("App.AuthForm.email")}
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
                    label={tApp("App.AuthForm.password")}
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
                                  ? tApp("App.AuthForm.hide_password")
                                  : tApp("App.AuthForm.show_password")
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
                      label={tApp("App.AuthForm.confirm_password")}
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
                  ? tApp("App.AuthForm.create_account")
                  : tApp("App.AuthForm.sign_in")}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2">
            {isSignup
              ? tApp("App.AuthForm.already_have_an_account")
              : tApp("App.AuthForm.no_account_yet")}

            <Link
              component={NextLink}
              href={authUrl(isSignup ? AppRoutes.LOGIN : AppRoutes.SIGN_UP, destination)}
            >
              {isSignup
                ? tApp("App.AuthForm.sign_in")
                : tApp("App.AuthForm.create_account")}
            </Link>
          </Typography>
        </Stack>
      </Card>
    </PageContainer>
  );
}
