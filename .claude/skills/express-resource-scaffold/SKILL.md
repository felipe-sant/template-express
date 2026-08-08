---
name: express-resource-scaffold
description: Como criar um novo recurso neste template Express, seguindo o padrão Controller → Service → Route. Use quando for adicionar uma rota, controller ou service novo.
---

# Express Resource Scaffold

Este template segue sempre a mesma receita de 3 camadas por recurso (Controller → Service → Route, descrita em detalhe abaixo). O módulo `__test__` (`src/controllers/__test__.controller.ts`, `src/routes/__test__.routes.ts`, `src/services/__test__.service.ts`) é só um **exemplo de guia** desse padrão, pensado para ser copiado/adaptado pelo usuário do template ao criar seus próprios recursos (`user`, `product`, etc.) — não é uma peça permanente da aplicação nem um contrato que o restante do código precise continuar satisfazendo. Se este projeto já tiver evoluído e o `__test__` já tiver sido removido/substituído pelos recursos reais, siga diretamente o "Passo a passo" abaixo em vez de procurar por ele.

## Passo a passo

1. Se o scaffold `__test__.*` ainda existir neste projeto, copie os três arquivos e renomeie para o novo recurso (ex.: `user.controller.ts`, `user.routes.ts`, `user.service.ts`). Se já tiver sido removido, crie os três arquivos do zero seguindo a estrutura descrita nos passos 3-6.
2. Renomeie as classes (`TestController` → `UserController`, etc.) e ajuste os imports entre os três arquivos.
3. Implemente a lógica de negócio real no `service` — é a única camada que deve conter regra de negócio.
4. No `controller`, mantenha o padrão de cada método (`create`/`read`/`readOne`/`update`/`patch`/`delete`, incluindo `PATCH` quando fizer sentido para o recurso — os seis verbos abaixo cobrem o CRUD completo):
    - extrair `req.params`/`req.query`/`req.body`, usando tipos nomeados de `src/types/*.types.ts` em vez de `unknown`/literais inline;
    - validação mínima (ex.: checar se o body existe: `if (!body || Object.keys(body).length === 0)`; com `noUncheckedIndexedAccess` ativo, `req.params.id` é `string | undefined` — valide antes de usar: `if (!id) { res.status(400)...; return }`);
    - delegar ao service **sempre com `await`**, mesmo que o método do service pareça síncrono hoje — omitir o `await` é um bug silencioso no primeiro service que fizer I/O real;
    - envolver tudo em `try/catch`, logando o erro (`console.error`) e retornando `res.sendStatus(500)` em caso de falha.
5. No `routes`, registre os verbos HTTP no construtor da classe `Router`, usando `.bind()` nos métodos do controller (eles são usados como callbacks standalone), inclusive `PATCH` (`this.router.patch(this.url_id, ...)`) quando o service implementar `patch`. Exporte o router de uma instância singleton, não a classe.
6. Registre o novo router em `src/app.ts`, **acima** do catch-all `app.use("/", ...)`:
    ```ts
    app.use("/api/<recurso>", <recurso>Routes)
    ```

## O que evitar

- Lógica de negócio dentro do controller — isso pertence ao service.
- Try/catch inconsistente entre métodos do mesmo controller.
- Chamar um método `async` do service sem `await` no controller.
- Registrar o novo router depois do catch-all em `src/app.ts` (a rota nunca será alcançada).
- Implementar um verbo no service (ex.: `patch`) sem expor o método correspondente no controller e a rota em `routes` — as três camadas devem manter paridade de verbos.
- Usar `unknown`/literais inline repetidos para o body/query/response do recurso em vez de um tipo nomeado em `src/types/*.types.ts`.
- Deixar código fora do padrão do Prettier/ESLint (rode `npm run format` e `npm run lint` antes de considerar a task concluída).
