# Memória de implementação

Consultar este documento antes de tomar decisões de implementação ou arquitetura. Atualizá-lo quando uma conversa estabelecer uma regra reutilizável ou alterar uma decisão anterior. As specs em `docs/specs/` continuam a ser a fonte de verdade do produto.

## Forma de trabalhar

- Agir como parceiro técnico: fazer pushback com argumentos quando houver riscos, trade-offs ou uma alternativa mais simples.
- Não transformar perguntas ou exploração de opções em autorização para alterar código.
- Depois de explicados os trade-offs e tomada a decisão, implementá-la sem criar bloqueios desnecessários.
- Comunicar de forma curta, direta e em português quando a conversa estiver em português.
- Para trabalho não trivial, analisar com Sol low e implementar com Luna medium quando a delegação trouxer valor. Evitar essa sobrecarga em mudanças pequenas e claras.

## Qualidade e estrutura do código

- Aplicar responsabilidade única. Isolar apresentação, edição, acesso à API, validação e regras de negócio quando isso tornar o código mais simples e testável.
- Manter funções focadas e abaixo de 200 linhas. Evitar componentes que concentrem modal, formulário, persistência e apresentação.
- Usar chavetas em todos os `if` e `else`. Não escrever condicionais sem chavetas.
- Preferir código explícito e legível a expressões ternárias aninhadas ou lógica demasiado compacta.
- Reutilizar helpers para parsing, datas, validação, respostas de API e regras usadas em mais do que um fluxo.
- Evitar abstrações prematuras. `useEffect` e `useRef` não são a primeira solução para sincronizar estado.
- Usar React Hook Form nos formulários não triviais, incluindo modais de edição. O formulário deve controlar valores, erros e estado de submissão.
- Escrever unit tests com valor para regras de negócio, helpers partilhados, casos limite e tratamento de erros. Não testar detalhes triviais da implementação.

## Idiomas e erros

- Usar `next-intl` e os dicionários em `app/messages/`. Não voltar a introduzir `useLocalization` nem variáveis `isEn` para escolher texto.
- A API devolve erros estáveis no formato `{ error: { code, details? } }`.
- O frontend traduz o `code`; mensagens apresentadas ao utilizador não pertencem às rotas ou serviços.
- Validar payloads e respostas externas e usar um fallback seguro para códigos ou respostas desconhecidos.

## Datas

- Manter parsing e formatação de datas em utilities genéricas.
- Usar Day.js quando já resolve a operação de forma clara, como o cálculo da idade.
- Datas de calendário no formato `YYYY-MM-DD` devem ser validadas estritamente e sem alterações causadas pelo fuso horário.

## Base de dados e concorrência

- Antes de criar ou alterar uma migration SQL, dar ao utilizador a oportunidade de fornecer ou tentar a query.
- Dados de jogador vivem em `player_profiles`, numa relação um-para-um com a tabela `user` do Better Auth. Não adicionar um JSON genérico de detalhes nem misturar campos de domínio na tabela de autenticação.
- O estado de founder é calculado no servidor a partir da data de registo e de um limite configurado. Não é uma coluna editável nem uma decisão do frontend.
- O índice parcial de `preferred_area` foi mantido para pesquisas por zona. Não implica ordenação dos jogadores.
- Para o MVP, `preferred_area` continua como texto validado pela API contra as áreas existentes. A normalização completa de áreas foi rejeitada porque obrigava a alterar `locations`, `pitches`, seeds e consultas sem benefício proporcional nesta fase.
- Conflitos de horário têm de ser garantidos no servidor ou na base de dados, incluindo pedidos simultâneos. A regra de sobreposição deve ser partilhada pela criação, edição e seletor do frontend, com testes de limites.

## Perfil do jogador

- O MVP acordado está documentado em `docs/specs/player-account-mvp.md` e `docs/specs/player-card.md`.
- Separar o cartão de leitura, o diálogo de edição e o cliente da API.
- Data de nascimento e email são privados. O cartão recebe apenas idade calculada e restantes dados públicos.
- Golos, assistências e respetiva verificação ficam para uma fase posterior.
- Até existir um estado de presença confirmada, `matches_played` conta provisoriamente as inscrições em jogos não cancelados cujo fim calculado já passou. Manter a consulta isolada para a poder trocar por presenças verificadas; este valor ainda não representa uma confirmação de presença real.
- As specs do projeto são escritas em português.

## Produto pendente

- A homepage deverá ter uma secção antes do footer para comunidade WhatsApp e contacto, conforme `docs/specs/homepage-community-cta.md`.
