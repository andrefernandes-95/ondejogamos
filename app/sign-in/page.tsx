"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (result.error) {
        setError(result.error.message ?? "Não foi possível enviar o código.");
        return;
      }

      setSent(true);
    } catch {
      setError("Não foi possível enviar o código. Tenta novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const result = await authClient.signIn.emailOtp({ email, otp, name });

      if (result.error) {
        setError(result.error.message ?? "O código não foi aceite.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Não foi possível confirmar o código. Tenta novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="wordmark" href="/">
          onde<span>jogamos</span>
        </Link>
      </header>

      <section className="auth-card" aria-labelledby="sign-in-title">
        <h1 id="sign-in-title">Entrar para jogar</h1>
        <p>Usamos o teu email para confirmar a inscrição. Sem palavra-passe.</p>

        {!sent ? (
          <form onSubmit={requestCode}>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              autoComplete="email"
              className="field-input"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
            <button className="button button-primary" disabled={busy} type="submit">
              {busy ? "A enviar…" : "Enviar código"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
            <p className="form-success">Código enviado para {email}.</p>
            <label className="field-label" htmlFor="otp">
              Código de acesso
            </label>
            <input
              autoComplete="one-time-code"
              className="field-input"
              id="otp"
              inputMode="numeric"
              onChange={(event) => setOtp(event.target.value)}
              required
              value={otp}
            />
            <label className="field-label" htmlFor="name">
              Nome apresentado nos jogos
            </label>
            <input
              autoComplete="nickname"
              className="field-input"
              id="name"
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
            <button className="button button-primary" disabled={busy} type="submit">
              {busy ? "A confirmar…" : "Confirmar e entrar"}
            </button>
            <button
              className="back-link"
              onClick={() => {
                setSent(false);
                setError("");
              }}
              type="button"
            >
              Usar outro email
            </button>
          </form>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
