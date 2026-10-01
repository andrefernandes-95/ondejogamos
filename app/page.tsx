import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="wordmark" href="/">
          onde<span>jogamos</span>
        </Link>
        <Link className="text-link" href="/sign-in">
          Entrar
        </Link>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">Futebol perto de ti</p>
        <h1 id="hero-title">Bora jogar?</h1>
        <p className="hero-copy">
          Estamos a preparar o primeiro jogo. Em breve vais poder encontrar
          futebol perto de ti.
        </p>
        <Link className="button button-primary" href="/sign-in">
          Começar
        </Link>
      </section>

      <section className="local-note" aria-label="Development status">
        <span className="status-dot" aria-hidden="true" />
        <p>Versão local em construção</p>
      </section>
    </main>
  );
}
