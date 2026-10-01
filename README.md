# Onde Jogamos

Uma forma simples de encontrar e combinar jogos de futebol: decidir quando e onde jogar e saber quem confirmou.

## Problema

Organizar um jogo em conversas dispersas torna difícil perceber a hora e o local finais, quantas pessoas vão e se ainda faltam jogadores.

## Decisões de produto

- O primeiro lançamento é apenas para futebol.
- Os jogos são públicos e podem ser encontrados por outras pessoas. Jogos privados podem chegar mais tarde.
- Para confirmar presença basta indicar o nome; não é necessário criar conta.
- O navegador guarda um cookie anónimo para reconhecer quem criou jogos e confirmou presenças; não há login.
- O organizador escolhe um campo do catálogo do município. Se não existir, pode criar um campo novo nesse município.

O primeiro público continua a ser uma hipótese: grupos e jogadores em Portugal que precisam de completar jogos de futebol.

## Primeiro percurso a construir

1. O organizador escolhe município e campo; se necessário, adiciona um campo com nome e localização.
2. Indica data, hora, número de vagas e, opcionalmente, uma nota; publica o jogo.
3. O jogo aparece na lista pública e tem um link que pode ser partilhado.
4. Um jogador encontra o jogo, vê os detalhes e confirma presença indicando o nome.
5. Todos veem os confirmados e as vagas restantes. No mesmo navegador, quem confirmou pode retirar a sua presença.
6. No mesmo navegador, o organizador pode atualizar ou cancelar o jogo; a página mostra claramente o estado atual.

## MVP

- Criar um jogo público associado a um município e a um campo.
- Listar os próximos jogos e filtrar por município.
- Consultar e partilhar a página de cada jogo por link.
- Escolher um campo existente ou adicionar um novo ao município.
- Confirmar ou retirar presença.
- Mostrar confirmados, capacidade e vagas restantes.
- Permitir ao organizador editar ou cancelar o jogo.
- Interface em português, confortável no telemóvel.

### Fora do primeiro lançamento

Jogos privados, pagamentos, reserva de campos, equipas equilibradas, chat próprio, rankings e notificações automáticas. Podemos acrescentá-los quando houver um problema real que justifique cada um.

## Identificação sem conta

- O servidor atribui ao navegador um identificador aleatório num cookie. A base de dados associa esse identificador aos jogos criados e às presenças confirmadas.
- O nome indicado é apenas o nome apresentado na lista de jogadores; não serve para provar a identidade.
- Criar, editar e cancelar um jogo ou alterar uma presença exige o cookie do navegador que fez a ação original.
- O cookie deve ser `HttpOnly`, `Secure` em produção e `SameSite=Lax`; o valor não deve conter nomes ou outros dados pessoais.
- Se a pessoa apagar o cookie ou mudar de navegador/dispositivo, perde a capacidade de gerir essas ações. Recuperação fica fora do MVP.

## Regras a fechar antes da implementação

- Que informação de cada campo é obrigatória. Proposta: nome, município e endereço ou link para o mapa.
- O que acontece quando o jogo fica cheio. Proposta: mostrar o estado «completo» e impedir novas confirmações; lista de espera fica para depois.
- Se um navegador pode confirmar mais do que um jogador no mesmo jogo. Proposta inicial: uma presença por navegador e jogo.

## O que aproveitar do projeto anterior

O repositório [tresquatrotres](https://github.com/andrefernandes-95/tresquatrotres/tree/main) já explora áreas e municípios portugueses, uma tabela de campos e uma interface inicial de criação de jogo. Podemos reutilizar as ideias e os dados geográficos. O fluxo de jogo e confirmações ainda terá de ser desenhado e implementado.

## Sequência proposta

1. Fechar os dados mínimos do campo e a regra de presenças por navegador.
2. Desenhar a lista pública, a criação e a página do jogo, incluindo estados vazio, completo e cancelado.
3. Implementar o percurso completo do MVP e testá-lo com um jogo real.
4. Observar onde a organização ainda exige mensagens paralelas e ajustar o produto.

**Sinal de sucesso inicial:** um organizador conseguir publicar um jogo e preencher as vagas com confirmações na página, sem precisar de reconstruir a lista de participantes no chat.
