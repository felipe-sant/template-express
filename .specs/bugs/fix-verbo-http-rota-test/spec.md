# Spec: fix-verbo-http-rota-test

## Tipo

Bug

## Problema

Em `src/routes/__test__.routes.ts`, a rota `/_` é registrada com `this.router.propfind(...)`, um verbo HTTP obscuro (WebDAV), mas o comentário imediatamente acima dela diz `` `GET | http://0.0.0.0:0000/api/test/_` ``. O mesmo comentário incoerente aparece em `src/controllers/__test__.controller.ts`, no JSDoc do método `__test__` (linha 112-114), que também documenta a rota como `GET` mesmo servindo um handler ligado a `propfind`.

Isso é particularmente problemático porque `src/routes/__test__.routes.ts` e `src/controllers/__test__.controller.ts` não são testes de fato — são o módulo de referência/scaffold que o `CLAUDE.md` instrui a copiar como base do padrão Controller → Service → Route para novos recursos. Um código de referência com documentação incoerente propaga o erro para todo novo recurso criado a partir dele, além de fazer a rota responder a um verbo (`PROPFIND`) que a maioria dos clientes HTTP comuns (browsers, `curl -X GET`, Postman com método padrão) não usa, tornando o endpoint de "smoke test" do scaffold, na prática, inacessível para quem espera `GET`.

## Objetivo

Tornar o verbo HTTP da rota `/_` coerente com o que a documentação (comentários) descreve, escolhendo o lado da correção que faz mais sentido para o propósito da rota:

- A rota `/_` → handler `__test__` no controller → `TestService.__test__()` não recebe params/query/body e apenas retorna um booleano fixo (`true`) traduzido em `200`/`500` — ou seja, é um endpoint de verificação simples (estilo "smoke test"/health-check), sem nenhuma razão de negócio para usar um verbo WebDAV como `PROPFIND`.
- Todas as demais rotas do scaffold (`POST`, `PUT`, `GET`, `GET /:id`, `DELETE`) usam verbos HTTP padrão do Express (`this.router.get/post/put/delete`), reforçando que o padrão do template é usar os métodos convencionais do `Router`.
- Portanto, a correção deve trocar `this.router.propfind(...)` por `this.router.get(...)` em `src/routes/__test__.routes.ts`, mantendo os comentários `GET` como estão (eles já refletem a intenção correta da rota).

## Fora de escopo

- Renomear a rota `/_`, o método `__test__` do controller/service, ou qualquer outra parte da assinatura do trio Controller → Service → Route.
- Alterar o comportamento de `TestService.__test__()` ou a lógica de resposta (200/500) do controller.
- Revisar ou corrigir outros comentários/rotas do template não relacionados a este verbo específico.
- Adicionar testes automatizados (não há framework de testes configurado no repositório).

## Critérios de aceite

- [ ] Em `src/routes/__test__.routes.ts`, a rota registrada em `this.url_test` ("/_") usa `this.router.get(...)` em vez de `this.router.propfind(...)`.
- [ ] O comentário acima dessa rota em `src/routes/__test__.routes.ts` continua descrevendo `` `GET | http://0.0.0.0:0000/api/test/_` `` (sem alteração de texto, já está correto).
- [ ] O JSDoc do método `__test__` em `src/controllers/__test__.controller.ts` continua descrevendo `` `GET | http://0.0.0.0:0000/api/test/_` `` (sem alteração de texto, já está correto).
- [ ] `npm run build` (checagem de tipos + compilação) executa sem erros após a alteração.
- [ ] `npm run lint` executa sem novos erros/warnings introduzidos pela alteração.
- [ ] Uma requisição `GET /api/test/_` (verbo GET padrão) para o servidor em execução (`npm run dev` ou `npm start`) responde `200` (assumindo que `TestService.__test__()` continua retornando `true`).

## Notas / decisões

- Optou-se por corrigir o verbo HTTP (código) em vez do comentário, porque:
  1. O handler não tem nenhuma característica que justifique um verbo WebDAV; é um endpoint de verificação simples, coerente com `GET` (idempotente, sem side effects, sem corpo de requisição).
  2. Todas as demais rotas do scaffold usam os verbos padrão do Express Router (`get`, `post`, `put`, `delete`) — manter `propfind` quebraria a consistência do próprio módulo de referência.
  3. Como este trio é copiado como base para novos recursos (conforme `CLAUDE.md`), preservar um verbo obscuro incentivaria o mesmo padrão incoerente em código novo.
- Não há necessidade de alterar `src/services/__test__.service.ts`; o método `__test__()` já é agnóstico a verbo HTTP.
