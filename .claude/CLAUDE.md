# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) para trabalhar com o código deste repositório.

## Visão geral do projeto

Este é um boilerplate/template para APIs Express + TypeScript. Os arquivos com prefixo `__test__` (`__test__.controller.ts`, `__test__.routes.ts`, `__test__.service.ts`) não são testes de fato — são um **exemplo de guia** que demonstra o padrão Controller → Service → Route, pensado para o usuário do template copiar/adaptar ao criar seus próprios recursos. Não é uma peça permanente da aplicação: pode ser removido depois que recursos reais existirem, e o padrão descrito neste documento continua valendo independentemente de o `__test__` ainda estar presente. Não há framework de testes configurado neste repositório (sem jest/mocha/vitest), apesar do nome `__test__`.

## Comandos

- `npm run dev` — roda o servidor de desenvolvimento com nodemon + ts-node, observando `src/**/*.ts` (hot reload, sem etapa de build).
- `npm run build` — checa tipos e compila `src` para `out/` via `tsc`.
- `npm start` — executa `prestart` (build) e depois `node out/index.js`. Use isso para rodar o build de produção compilado.
- `npm run lint` — roda o ESLint no projeto.
- `npm run format` — roda o Prettier (`prettier --write .`) para reformatar o projeto conforme o `.prettierrc`.
- `npm run create-image` — builda a imagem Docker (`docker build -t image .`).
- `npm run create-container` — roda o container Docker, mapeando a porta 3001 do host para a porta 3000 do container.

Atualmente não há suíte/runner de testes neste projeto.

## Arquitetura

Estrutura em camadas por recurso, conectadas em `src/app.ts`:

- **Routes** (`src/routes/*.routes.ts`) — uma classe que encapsula um `Router` do Express. O construtor registra todos os bindings de verbos HTTP com os métodos do controller (usando `.bind()`, já que os métodos do controller são usados como callbacks independentes). Expõe `getRouter()`. O módulo exporta o router de uma instância singleton, não a classe.
- **Controllers** (`src/controllers/*.controller.ts`) — uma classe que instancia seu respectivo service no construtor. Cada método é um handler assíncrono do Express: extrai `req.params`/`req.query`/`req.body`, faz validações mínimas (ex.: checagem de body obrigatório), delega ao service e envolve tudo em um try/catch que loga o erro e retorna `res.sendStatus(500)` em caso de falha.
- **Services** (`src/services/*.service.ts`) — uma classe simples contendo a lógica de negócio, atualmente retornando dados mock/echo no template. É aqui que entraria a persistência/lógica de negócio real.
- O registro de rotas de um recurso acontece em `src/app.ts` via `app.use("/api/<recurso>", <recurso>Routes)`. Um catch-all `app.use("/", ...)` no final retorna 404 para qualquer coisa não mapeada — novos routers de recursos precisam ser registrados antes dessa linha.

Para adicionar um novo recurso, copie o trio controller/route/service `__test__` (se ainda presente neste projeto — é só um exemplo de guia, não obrigatório manter), renomeie e registre o novo router em `src/app.ts`. Ver skill `express-resource-scaffold` para o passo a passo completo.

### Middleware de log de requisições

`src/middleware/requestLogger.middleware.ts` roda em toda requisição. No evento `finish` da resposta, ele acrescenta uma linha JSON (data, método, url, status, duração) a um arquivo local `request.log`, usando os helpers `readFile`/`createFile` em `src/utils/`. É uma escrita de arquivo fire-and-forget, não um serviço de log externo.

### Ambiente / deploy

- O `.env` é carregado via `dotenv` em `src/app.ts`; existe um `.env.example` como template. O `src/index.ts` lê a porta de `process.env.PORT`, com fallback para `3000` quando a variável não estiver definida.
- O `vercel.json` builda `src/index.ts` diretamente com `@vercel/node` e roteia todos os caminhos para ele — isso ignora o build `npm run build`/pasta `out` usado pelo Docker/`npm start`.
- `vercel.json` restringe deploy automático à branch `main` via `git.deploymentEnabled` (`"main": true, "*": false`) — push em outras branches não dispara preview deployment.
- O `Dockerfile` é um build em dois estágios: compila com `tsc` em um estágio builder, depois copia `out/` e `.env` para um estágio de produção mais leve. Se um projeto não tiver `.env`, remova a linha `COPY .env ./` (observação já indicada inline no Dockerfile).

## Padrão de branches, commits e PRs

Toda branch, commit e PR deste repositório segue o padrão definido em `CONTRIBUTING.md`: branches como `<tipo>/<número-da-issue>-<descrição-curta>` (ex.: `fix/17-request-logger-appendfile`) e commits como `<Tipo> <ícone> [#<número-da-issue>] <descrição>` (ex.: `Fix :bug: [#17] ...`), usando um dos tipos da tabela de `CONTRIBUTING.md` (Fix, Feat, Hotfix, Refactor, Test, Perf, Style, Docs, Build, Chore, Revert) — não use labels do GitHub (ex.: `enhancement`) como `<tipo>` da branch/commit. A descrição do PR segue a estrutura de `.github/PULL_REQUEST_TEMPLATE.md` (Descrição, Alterações, Decisões técnicas, Como testar, Evidências, Impactos e pontos de atenção), não um corpo livre.

## Convenção de tipagem

O `tsconfig.json` já habilita `strict: true` (o que inclui `noImplicitAny`) e, além disso, mantém ativos `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride` e `noUncheckedIndexedAccess`. Isso significa que o compilador já bloqueia `any` implícito, variáveis/parâmetros não usados, funções sem retorno explícito em todo caminho, fallthrough silencioso em `switch`, overrides não marcados e acesso indexado (`req.query`/`req.params`, arrays, index signatures) sem tratar o `undefined` resultante. Além disso:

- Não introduza `any` explícito no código — se um tipo for difícil de expressar, prefira `unknown` com uma checagem, ou modele o tipo corretamente.
- Tipos de retorno de funções assíncronas e handlers devem ser explícitos, não inferidos (ex.: `async function createLogger(log: RequestLogEntry): Promise<void>`, `function requestLoggerMiddleware(...): void`).
- Prefira um type/interface nomeado (em `src/types/*.types.ts`) a um literal inline repetido em mais de um lugar (parâmetro de função e objeto montado no call site, por exemplo) — evita duplicação e facilita reuso por outros módulos.
- Com `noUncheckedIndexedAccess` ativo, todo acesso a um campo individual de `req.params.<campo>` (ex.: `req.params.id`) retorna `string | undefined` — trate isso com uma validação explícita (ex.: `if (!id) { res.status(400)...; return }`), igual ao padrão aplicado no scaffold `__test__` (quando presente), em vez de recorrer a `as`/cast para forçar o tipo e mascarar o `undefined`. Já o cast do objeto `req.query`/`req.body` inteiro para um tipo nomeado (ex.: `req.query as TestResourceQuery`) é uma simplificação aceita por ora — o objeto continua sem validação de schema em runtime até a spec de validação de entrada (zod) ser implementada; não confunda essa simplificação com o caso de `req.params.<campo>` acima, que já tem tratamento obrigatório.
- Toda chamada a um método `async` de um `Service` dentro de um `Controller` deve usar `await` — mesmo que o service atual seja síncrono, omitir o `await` é um bug silencioso no primeiro service que fizer I/O real.

Exemplo já aplicado no repositório: `RequestLogEntry` (`src/types/requestLog.types.ts`) é usado tanto no parâmetro de `createLogger` quanto na variável `log` montada em `requestLoggerMiddleware` (`src/middleware/requestLogger.middleware.ts`), no lugar do literal inline que existia antes. Da mesma forma, `TestResourceBody`/`TestResourceQuery`/`TestResourceResponse` (`src/types/testResource.types.ts`) tipam o body/query/response do scaffold `__test__` em vez de `unknown` genérico.

## Qualidade de código e formatação

- **ESLint** (`eslint.config.mts`) roda sobre um projeto Node — usa `globals.node` (não `globals.browser`), já que os globals de browser (`window`, `document`, ...) não existem no runtime real.
- **Prettier** está integrado ao projeto: `.prettierrc` na raiz define o estilo (`semi: false`, `singleQuote: false`, `tabWidth: 4`, `useTabs: false`, `printWidth: 100`, `trailingComma: "all"`), `eslint-config-prettier` está incluído em `eslint.config.mts` para não conflitar com as regras de formatação do ESLint, e `npm run format` (`prettier --write .`) aplica o estilo. Rode `npm run format` antes de finalizar qualquer tarefa que edite código.
- Todo código novo deve nascer conforme ESLint + Prettier + os checks do `tsconfig.json` (ver "Convenção de tipagem" acima) — não é aceitável escrever primeiro fora do padrão e corrigir depois só na revisão.
- **Paridade CRUD do scaffold:** cada verbo implementado no `Service` (`create`/`read`/`readOne`/`update`/`patch`/`delete`) deve ter um método correspondente no `Controller` e uma rota registrada em `Routes` — se um novo recurso não precisar de um verbo, remova-o das três camadas em conjunto, não deixe implementado em uma camada e ausente nas outras (como acontecia com `PATCH` no scaffold `__test__` antes de `TestController`/`TestRoutes` expô-lo).

## Tooling de IA (skills, agents e spec-driven)

- `.claude/skills/` — pacotes de conhecimento carregáveis a pedido (`express-resource-scaffold`, `express-request-logging`), complementando este arquivo com o passo a passo detalhado de cada convenção.
- `.claude/agents/` — três papéis que formam o fluxo planejar → revisar → executar: `sdd` (só planeja, escreve `spec.md`/`tasks.md` em `.docs/`, nunca toca em `src/`), `executor` (implementa um `tasks.md` já aprovado) e `reviewer` (audita o resultado contra as convenções deste arquivo, somente leitura).
- `.docs/` — pastas de spec por feature/bug (`.docs/features/<slug>/`, `.docs/bugs/<slug>/`), a partir do template em `.docs/_template/`. Fluxo: `sdd` escreve a spec → aprovação humana → `executor` implementa task por task → `reviewer` audita antes do commit/PR.
