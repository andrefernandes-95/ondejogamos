# Onde Jogamos

Uma forma simples de encontrar e combinar jogos de futebol: decidir quando e onde jogar e saber quem confirmou.

## Problema

Organizar um jogo em conversas dispersas torna difícil perceber a hora e o local finais, quantas pessoas vão e se ainda faltam jogadores.

## Decisões de produto

- O primeiro lançamento é apenas para futebol.
- Os jogos são públicos e podem ser encontrados por outras pessoas. Jogos privados podem chegar mais tarde.
- Qualquer pessoa pode consultar jogos sem entrar na aplicação.
- Para criar jogos ou campos e confirmar presença, a pessoa entra com um código enviado por email. Na primeira entrada escolhe o nome que será apresentado nos jogos.
- Cada conta pode confirmar uma presença por jogo e geri-la noutro navegador ou dispositivo.
- O organizador escolhe um campo do catálogo do município. Se não existir, pode criar um campo novo nesse município.

O primeiro público continua a ser uma hipótese: grupos e jogadores em Portugal que precisam de completar jogos de futebol.

## Primeiro percurso a construir

1. O organizador entra com um código enviado por email, escolhe município e campo e, se necessário, adiciona um campo com nome e localização.
2. Indica data, hora, número de vagas e, opcionalmente, uma nota; publica o jogo.
3. O jogo aparece na lista pública e tem um link que pode ser partilhado.
4. Um jogador encontra o jogo e vê os detalhes sem entrar. Para confirmar presença, entra com um código enviado por email e escolhe o nome apresentado na primeira vez.
5. Todos veem os confirmados e as vagas restantes. Quem confirmou pode entrar novamente e retirar a sua presença.
6. O organizador pode entrar novamente para atualizar ou cancelar o jogo; a página mostra claramente o estado atual.

## MVP

- Criar um jogo público associado a um município e a um campo.
- Entrar por código de email para criar jogos ou campos e gerir presenças; consultar jogos não exige entrada.
- Listar os próximos jogos e filtrar por município.
- Consultar e partilhar a página de cada jogo por link.
- Escolher um campo existente ou adicionar um novo ao município.
- Confirmar ou retirar presença.
- Mostrar confirmados, capacidade e vagas restantes.
- Permitir ao organizador editar ou cancelar o jogo.
- Interface em português, confortável no telemóvel.

### Fora do primeiro lançamento

Jogos privados, pagamentos, reserva de campos, equipas equilibradas, chat próprio, rankings e notificações automáticas. Podemos acrescentá-los quando houver um problema real que justifique cada um.

## Contas e permissões

- A conta é identificada por um email verificado através de um código de entrada, sem palavra-passe.
- O email não aparece nas páginas públicas. O nome escolhido é apresentado na lista de jogadores.
- Só o criador pode editar ou cancelar o seu jogo. Só a pessoa inscrita pode retirar a própria presença.
- Uma pessoa pode voltar a entrar com o mesmo email noutro dispositivo para gerir os seus jogos e presenças.
- A implementação deve usar uma solução de autenticação estabelecida para gerir os códigos e as sessões, em vez de criar um sistema de sessões anónimas.

## Regras a fechar antes da implementação

- Que informação de cada campo é obrigatória. Proposta: nome, município e endereço ou link para o mapa.
- O que acontece quando o jogo fica cheio. Proposta: mostrar o estado «completo» e impedir novas confirmações; lista de espera fica para depois.
- Se um organizador pode inscrever jogadores que ainda não têm conta. Proposta inicial: cada jogador confirma a sua própria presença.

## O que aproveitar do projeto anterior

O repositório [tresquatrotres](https://github.com/andrefernandes-95/tresquatrotres/tree/main) já explora áreas e municípios portugueses, uma tabela de campos e uma interface inicial de criação de jogo. Podemos reutilizar as ideias e os dados geográficos. O fluxo de jogo e confirmações ainda terá de ser desenhado e implementado.

## Sequência proposta

1. Fechar os dados mínimos do campo e a regra para jogadores sem conta.
2. Desenhar a lista pública, a criação e a página do jogo, incluindo estados vazio, completo e cancelado.
3. Implementar o percurso completo do MVP e testá-lo com um jogo real.
4. Observar onde a organização ainda exige mensagens paralelas e ajustar o produto.

**Sinal de sucesso inicial:** um organizador conseguir publicar um jogo e preencher as vagas com confirmações na página, sem precisar de reconstruir a lista de participantes no chat.
