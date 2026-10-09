# TODO:

## Require for MVP

### Bugs

Depois de agendar um jogo, fechas o modal, mas a lista não volta a carregar.
No formulário de criar campo, a imagem pode ser null, mas o servidor exige uma imagem.
Nos jogos, os números precisam de validação de inteiro: 10.5 jogadores pode passar no Zod e falhar na coluna INT.
Um link partilhável para o jogo já dá muito valor;

- [] Add Footer
- [] When Choosing A Area, Show The Pitches Count
- [] When Adding A Game To A Area With No Pitches, Prompt The User to add a pitch first

## FUTURE

- [] Pay to organizer for approval (user inserts mbway phone)
- Não existe um fluxo para cancelar um jogo. A listagem também não filtra jogos passados ou cancelados.
- O criador é contado como participante através de attendances.length + 1, mas não tem uma inscrição correspondente.
