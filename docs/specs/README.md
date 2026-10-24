# Épico da conta do jogador

**Estado:** MVP acordado · pronto para planear a implementação.

```mermaid
flowchart TD
  A[Navbar: Conta] --> P[Ver perfil]
  P --> C[Cartão de jogador estilo FIFA]
  C --> E[Lápis de edição → modal Editar perfil]
  A --> M[Gerir conta]
  A --> R[Preferências]
```

- [Cartão do jogador](player-card.md): perfil visível para a comunidade e cartão partilhável.
- [Gestão da conta](account-management.md): identidade e eliminação da conta.
- [Preferências de email](email-preferences.md): notificações opcionais sobre jogos.
- [MVP acordado](player-account-mvp.md): âmbito final e critérios de aceitação.

Os dados públicos do perfil, os dados privados da conta e as preferências de notificações devem permanecer separados.
