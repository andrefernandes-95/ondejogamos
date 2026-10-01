# Onde Jogamos

Uma forma simples de encontrar e combinar jogos de futebol: decidir quando e onde jogar e saber quem confirmou.

## Problema

Organizar um jogo em conversas dispersas torna difícil perceber a hora e o local finais, quantas pessoas vão e se ainda faltam jogadores.

## Decisões de produto

- O primeiro lançamento é apenas para futebol.
- Os jogos são públicos e podem ser encontrados por outras pessoas. Jogos privados podem chegar mais tarde.
- Para confirmar presença basta indicar o nome; não é necessário criar conta.
- O organizador escolhe um campo do catálogo do município. Se não existir, pode criar um campo novo nesse município.

O primeiro público continua a ser uma hipótese: grupos e jogadores em Portugal que precisam de completar jogos de futebol.

## Primeiro percurso a construir

1. O organizador escolhe município e campo; se necessário, adiciona um campo com nome e localização.
2. Indica data, hora, número de vagas e, opcionalmente, uma nota; publica o jogo.
3. O jogo aparece na lista pública e tem um link que pode ser partilhado.
4. Um jogador encontra o jogo, vê os detalhes e confirma presença indicando o nome.
5. Todos veem os confirmados e as vagas restantes. Quem confirmou pode retirar a sua presença.
6. O organizador pode atualizar ou cancelar o jogo; a página mostra claramente o estado atual.

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

## Regras a fechar antes da implementação

- Como comprovar que a mesma pessoa pode alterar ou retirar a presença sem conta. Proposta: dar-lhe um link pessoal de gestão após a confirmação.
- Como o organizador volta a editar o jogo sem conta. Proposta: um link de gestão separado do link público.
- Que informação de cada campo é obrigatória. Proposta: nome, município e endereço ou link para o mapa.
- O que acontece quando o jogo fica cheio. Proposta: mostrar o estado «completo» e impedir novas confirmações; lista de espera fica para depois.

## O que aproveitar do projeto anterior

O repositório [tresquatrotres](https://github.com/andrefernandes-95/tresquatrotres/tree/main) já explora áreas e municípios portugueses, uma tabela de campos e uma interface inicial de criação de jogo. Podemos reutilizar as ideias e os dados geográficos. O fluxo de jogo e confirmações ainda terá de ser desenhado e implementado.

## Sequência proposta

1. Fechar as regras de gestão sem conta e os dados mínimos do campo.
2. Desenhar a lista pública, a criação e a página do jogo, incluindo estados vazio, completo e cancelado.
3. Implementar o percurso completo do MVP e testá-lo com um jogo real.
4. Observar onde a organização ainda exige mensagens paralelas e ajustar o produto.

**Sinal de sucesso inicial:** um organizador conseguir publicar um jogo e preencher as vagas com confirmações na página, sem precisar de reconstruir a lista de participantes no chat.
