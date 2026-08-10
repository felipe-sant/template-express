---
name: express-resource-scaffold
description: Como criar um novo recurso neste template Express, seguindo o padrão Controller → Service → Route. Use quando for adicionar uma rota, controller ou service novo.
---

# Express Resource Scaffold

Este template segue sempre a mesma receita de 3 camadas por recurso (Controller → Service → Route, descrita em detalhe abaixo). O módulo `preview` (`src/controllers/preview.controller.ts`, `src/routes/preview.routes.ts`, `src/services/preview.service.ts`) é só um **exemplo de guia** desse padrão, pensado para ser copiado/adaptado pelo usuário do template ao criar seus próprios recursos (`user`, `product`, etc.) — não é uma peça permanente da aplicação nem um contrato que o restante do código precise continuar satisfazendo. Se este projeto já tiver evoluído e o `preview` já tiver sido removido/substituído pelos recursos reais, siga diretamente o "Passo a passo" abaixo em vez de procurar por ele.

## Passo a passo

1. Se o scaffold `preview.*` ainda existir neste projeto, copie os três arquivos e renomeie para o novo recurso (ex.: `user.controller.ts`, `user.routes.ts`, `user.service.ts`). Se já tiver sido removido, crie os três arquivos do zero seguindo a estrutura descrita nos passos 3-6.
2. Renomeie as classes (`PreviewController` → `UserController`, etc.) e ajuste os imports entre os três arquivos.
3. Implemente a lógica de negócio real no `service` — é a única camada que deve conter regra de negócio.
4. No `controller`, mantenha o padrão de cada método (`create`/`read`/`readOne`/`update`/`patch`/`delete`, incluindo `PATCH` quando fizer sentido para o recurso — os seis verbos abaixo cobrem o CRUD completo):
    - cada handler recebe `next: NextFunction` como terceiro parâmetro (assinatura `(req, res, next)`), necessário para delegar erros ao error-handler central;
    - extrair `req.params`/`req.query`/`req.body`, usando tipos nomeados de `src/types/*.types.ts` em vez de `unknown`/literais inline;
    - validação mínima (ex.: checar se o body existe: `if (!body || Object.keys(body).length === 0)`; com `noUncheckedIndexedAccess` ativo, `req.params.id` é `string | undefined` — valide antes de usar) fazendo `next(new BadRequestError("..."))` seguido de `return`, usando a hierarquia de erros de `src/errors/` (`AppError`/`NotFoundError`/`BadRequestError`) em vez de montar `res.status(400).json({ message })` manualmente:
        ```ts
        if (!id) {
            next(new BadRequestError("id is required!"))
            return
        }
        ```
    - delegar ao service **sempre com `await`**, mesmo que o método do service pareça síncrono hoje — omitir o `await` é um bug silencioso no primeiro service que fizer I/O real;
    - toda resposta de sucesso com corpo usa o envelope `res.status(<2xx>).json({ data: result })` em vez de `res.status(<2xx>).json(result)`; exceção: `204 No Content` (ex.: `delete`) usa `res.sendStatus(204)` sem corpo;
    - envolver tudo em `try/catch` e, no `catch`, chamar `next(error)` — em vez de logar com `console.error` e retornar `res.sendStatus(500)` — delegando o tratamento ao middleware central `src/middleware/errorHandler.middleware.ts` (registrado como último `app.use(...)` em `src/app.ts`):
        ```ts
        } catch (error: unknown) {
            next(error)
        }
        ```
5. No `routes`, registre os verbos HTTP no construtor da classe `Router`, usando `.bind()` nos métodos do controller (eles são usados como callbacks standalone), inclusive `PATCH` (`this.router.patch(this.url_id, ...)`) quando o service implementar `patch`. Exporte o router de uma instância singleton, não a classe.
6. Registre o novo router em `src/app.ts`, **acima** do catch-all `app.use("/", ...)`:
    ```ts
    app.use("/api/<recurso>", <recurso>Routes)
    ```
7. Copie/adapte também o teste de integração co-localizado do scaffold `preview` para o novo recurso, nomeado `src/routes/<recurso>.routes.test.ts` (mesmo padrão co-localizado, sufixo `.test.ts`, sem diretório `__tests__` dedicado), usando `src/routes/preview.routes.test.ts` como exemplo/ponto de partida. Antes de escrever qualquer caso de teste, liste os cenários de validação/erro que o `Controller` do novo recurso realmente trata (por rota) — e só então cubra cada um com um caso de teste separado, mais o caminho completo, em vez de escrever "sucesso + um erro genérico". Consulte o skill `vitest-specialist` (`.claude/skills/vitest-specialist/SKILL.md`), que documenta os padrões de teste por camada (Rota via `supertest`, Controller via chamada direta ao método para cenários inalcançáveis via HTTP real), antes de escrever o `.test.ts`.

## O que evitar

- Lógica de negócio dentro do controller — isso pertence ao service.
- Try/catch inconsistente entre métodos do mesmo controller.
- Chamar um método `async` do service sem `await` no controller.
- Registrar o novo router depois do catch-all em `src/app.ts` (a rota nunca será alcançada).
- Implementar um verbo no service (ex.: `patch`) sem expor o método correspondente no controller e a rota em `routes` — as três camadas devem manter paridade de verbos.
- Usar `unknown`/literais inline repetidos para o body/query/response do recurso em vez de um tipo nomeado em `src/types/*.types.ts`.
- Escrever apenas "sucesso + um erro genérico" na suíte do novo recurso — cubra cada cenário de validação/erro que o controller realmente trata, seguindo a convenção de cobertura exaustiva (ver `src/routes/preview.routes.test.ts` como referência).
- Deixar código fora do padrão do Prettier/ESLint ou sem suíte de testes passando (rode `npm run format`, `npm run lint` e `npm test` — e, se fizer sentido, `npm run test:cov` para conferir cobertura — antes de considerar a task concluída).
