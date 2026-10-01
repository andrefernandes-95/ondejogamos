# Onde Jogamos

Uma forma simples de combinar jogatanas com amigos: decidir quando e onde jogar, convidar o grupo e saber quem confirmou.

## Problema

Organizar um jogo em conversas dispersas torna difícil perceber a hora e o local finais, quantas pessoas vão e se ainda faltam jogadores.

## Hipóteses para validar

- O primeiro público são grupos de amigos que organizam jogos de futebol em Portugal.
- O organizador quer criar um jogo e partilhar um link no grupo onde já conversa.
- Os convidados querem confirmar presença em poucos passos, sobretudo no telemóvel.

Estas hipóteses orientam o primeiro protótipo; ainda não são requisitos fechados.

## Primeiro percurso a construir

1. O organizador indica data, hora, local, número de vagas e, opcionalmente, uma nota.
2. Recebe uma página do jogo e partilha o link com o grupo.
3. Cada convidado vê os detalhes e confirma ou retira a presença.
4. Todos veem a lista de confirmados e quantas vagas restam.
5. O organizador pode atualizar ou cancelar o jogo; a página mostra claramente o estado atual.

## MVP

- Criar e consultar um jogo.
- Partilhar o jogo por link.
- Confirmar ou retirar presença.
- Mostrar confirmados, capacidade e vagas restantes.
- Permitir ao organizador editar ou cancelar o jogo.
- Interface em português, confortável no telemóvel.

### Fora do primeiro lançamento

Pagamentos, reserva de campos, equipas equilibradas, chat próprio, rankings, descoberta pública de jogos e notificações automáticas. Podemos acrescentá-los quando houver um problema real que justifique cada um.

## Decisões de produto pendentes

1. O produto começa apenas com futebol ou deve servir outros desportos desde o primeiro dia?
2. Os jogos são apenas para grupos convidados por link ou também podem ser públicos?
3. É necessário criar conta para confirmar presença, ou basta indicar o nome?
4. O local é escolhido livremente pelo organizador ou deve vir de um catálogo de campos?

## O que aproveitar do projeto anterior

O repositório [tresquatrotres](https://github.com/andrefernandes-95/tresquatrotres/tree/main) já explora áreas e municípios portugueses, uma tabela de campos e uma interface inicial de criação de jogo. Podemos reutilizar as ideias e os dados geográficos. O fluxo de jogo e confirmações ainda terá de ser desenhado e implementado.

## Sequência proposta

1. Validar as quatro decisões acima com o primeiro grupo de utilizadores.
2. Desenhar as páginas de criação e de jogo, incluindo estados vazio, cheio e cancelado.
3. Implementar o percurso completo do MVP e testá-lo com um jogo real.
4. Observar onde a organização ainda exige mensagens paralelas e ajustar o produto.

**Sinal de sucesso inicial:** um grupo conseguir marcar um jogo e fechar as presenças usando o link, sem precisar de reconstruir a lista de participantes no chat.
