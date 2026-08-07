# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) para trabalhar com o código deste repositório.

## Visão geral do projeto

Este é um boilerplate/template para APIs Express + TypeScript. Os arquivos com prefixo `__test__` (`__test__.controller.ts`, `__test__.routes.ts`, `__test__.service.ts`) não são testes de fato — são um módulo de referência/scaffold que demonstra o padrão Controller → Service → Route que novas features devem copiar. Não há framework de testes configurado neste repositório (sem jest/mocha/vitest), apesar do nome `__test__`.

## Comandos

- `npm run dev` — roda o servidor de desenvolvimento com nodemon + ts-node, observando `src/**/*.ts` (hot reload, sem etapa de build).
- `npm run build` — checa tipos e compila `src` para `out/` via `tsc`.
- `npm start` — executa `prestart` (build) e depois `node out/src/index.js`. Use isso para rodar o build de produção compilado.
- `npm run lint` — roda o ESLint no projeto.
- `npm run create-image` — builda a imagem Docker (`docker build -t image .`).
- `npm run create-container` — roda o container Docker, mapeando a porta 3001 do host para a porta 3000 do container.

Atualmente não há suíte/runner de testes neste projeto.

## Arquitetura

Estrutura em camadas por recurso, conectadas em `src/app.ts`:

- **Routes** (`src/routes/*.routes.ts`) — uma classe que encapsula um `Router` do Express. O construtor registra todos os bindings de verbos HTTP com os métodos do controller (usando `.bind()`, já que os métodos do controller são usados como callbacks independentes). Expõe `getRouter()`. O módulo exporta o router de uma instância singleton, não a classe.
- **Controllers** (`src/controllers/*.controller.ts`) — uma classe que instancia seu respectivo service no construtor. Cada método é um handler assíncrono do Express: extrai `req.params`/`req.query`/`req.body`, faz validações mínimas (ex.: checagem de body obrigatório), delega ao service e envolve tudo em um try/catch que loga o erro e retorna `res.sendStatus(500)` em caso de falha.
- **Services** (`src/services/*.service.ts`) — uma classe simples contendo a lógica de negócio, atualmente retornando dados mock/echo no template. É aqui que entraria a persistência/lógica de negócio real.
- O registro de rotas de um recurso acontece em `src/app.ts` via `app.use("/api/<recurso>", <recurso>Routes)`. Um catch-all `app.use("/", ...)` no final retorna 404 para qualquer coisa não mapeada — novos routers de recursos precisam ser registrados antes dessa linha.

Para adicionar um novo recurso, copie o trio controller/route/service `__test__`, renomeie e registre o novo router em `src/app.ts`.

### Middleware de log de requisições

`src/middleware/requestLogger.middleware.ts` roda em toda requisição. No evento `finish` da resposta, ele acrescenta uma linha JSON (data, método, url, status, duração) a um arquivo local `request.log`, usando os helpers `readFile`/`createFile` em `src/utils/`. É uma escrita de arquivo fire-and-forget, não um serviço de log externo.

### Ambiente / deploy

- O `.env` é carregado via `dotenv` em `src/app.ts`; existe um `.env.example` como template. O `src/index.ts` atualmente fixa a porta em `3000` em vez de lê-la do ambiente.
- O `vercel.json` builda `src/index.ts` diretamente com `@vercel/node` e roteia todos os caminhos para ele — isso ignora o build `npm run build`/pasta `out` usado pelo Docker/`npm start`.
- O `Dockerfile` é um build em dois estágios: compila com `tsc` em um estágio builder, depois copia `out/` e `.env` para um estágio de produção mais leve. Se um projeto não tiver `.env`, remova a linha `COPY .env ./` (observação já indicada inline no Dockerfile).

## Tooling de IA (skills, agents e spec-driven)

- `.claude/skills/` — pacotes de conhecimento carregáveis a pedido (`express-resource-scaffold`, `express-request-logging`), complementando este arquivo com o passo a passo detalhado de cada convenção.
- `.claude/agents/` — três papéis que formam o fluxo planejar → revisar → executar: `sdd` (só planeja, escreve `spec.md`/`tasks.md` em `.specs/`, nunca toca em `src/`), `executor` (implementa um `tasks.md` já aprovado) e `reviewer` (audita o resultado contra as convenções deste arquivo, somente leitura).
- `.specs/` — pastas de spec por feature/bug (`.specs/features/<slug>/`, `.specs/bugs/<slug>/`), a partir do template em `.specs/_template/`. Fluxo: `sdd` escreve a spec → aprovação humana → `executor` implementa task por task → `reviewer` audita antes do commit/PR.
