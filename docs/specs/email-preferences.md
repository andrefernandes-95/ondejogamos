# Preferências de email

**Estado:** MVP acordado

```mermaid
flowchart LR
  Settings[Preferências] --> Nearby[Emails sobre jogos próximos]
  Settings --> Weekly[Email com agenda semanal]
  Nearby --> Opt1[Jogador pode ativar ou desativar]
  Weekly --> Opt2[Jogador pode ativar ou desativar]
```

O jogador pode ativar separadamente:

- Emails quando forem agendados jogos perto da sua zona preferida.
- Um email semanal com os jogos em que está inscrito.

Cada preferência pode ser desativada de forma independente. Os emails devem incluir ligações para a aplicação e para a gestão das preferências.

As duas preferências começam desativadas e exigem consentimento explícito. A definição de “próximo” usa a zona preferida do jogador. O email semanal usa o fuso horário do jogador e inclui apenas os jogos da semana seguinte em que está inscrito.
