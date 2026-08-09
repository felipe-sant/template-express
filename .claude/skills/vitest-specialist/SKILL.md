---
name: vitest-specialist
description: Como escrever testes com Vitest + Supertest neste template Express, seguindo TDD (Red → Green → Refactor) e a convenção de cobertura exaustiva de cenários por rota. Use sempre que for criar/atualizar um arquivo `*.test.ts` em `src/`.
---

# Vitest Specialist (Express + TypeScript)

> Adaptado do skill `vitest-specialist` do `ai-core` (stack React) para o stack deste template: sem componentes/hooks/RTL — o equivalente aqui é a camada Controller → Service → Route, testada via `supertest` (integração) e chamada direta ao controller (unidade, para branches inalcançáveis via HTTP real).

## Quando usar

- Escrever o teste de uma rota nova (`src/routes/<recurso>.routes.test.ts`) seguindo o padrão do scaffold `preview`.
- Adicionar um teste antes de implementar um comportamento (TDD).
- Reproduzir um bug com um teste que falha antes de corrigi-lo.
- Revisar a qualidade/cobertura de uma suíte já existente.

---

## Convenções deste projeto (não são default do Vitest)

- **Co-localizado, sufixo `.test.ts`, sem diretório dedicado.** Todo arquivo de `src/` que tiver teste tem seu `<nome>.test.ts` na mesma pasta (ex.: `src/routes/preview.routes.ts` → `src/routes/preview.routes.test.ts`). Nada de `__tests__/`/`.spec/` — isso já foi decidido para este repositório.
- **Escopo de teste é só `src/`.** `vitest.config.ts` descobre testes por `src/**/*.test.ts`; `out/` (build) e arquivos de configuração não são cobertos.
- **Gate de cobertura: 80%** (lines/branches/functions/statements, provider `v8`) via `test:cov` (`vitest run --coverage`). `npm test` roda a suíte sem o gate; `npm run test:cov` é o que roda no CI.
- **Cobertura exaustiva de cenários por rota.** Testar uma rota não é "sucesso + um erro genérico": é um caso de teste por cenário de validação/erro que o `Controller` realmente trata (veja o método antes de escrever o teste), mais o caminho completo. Não invente cenário que o controller não trata, nem deixe de cobrir um que ele trata.
- **Erros passam por `next(...)`, nunca por `res.status(...).json(...)` direto no controller** (ver `CLAUDE.md`, "Tratamento de erros centralizado"). Isso muda como você testa erro: contra `supertest`, o corpo esperado é o envelope `{ error: { code, message } }` montado pelo `errorHandler` central — não assuma o formato de erro dentro do próprio teste do controller sem passar pelo middleware, a menos que esteja testando o controller isoladamente (mock de `next`).

---

## TDD Workflow — Red → Green → Refactor

Siga este ciclo para **cada** unidade de comportamento. Nunca pule etapas.

### Passo 0 — CONTEXTO: leia antes de escrever

A qualidade do teste é limitada pelo contexto que você reuniu. Antes do primeiro `it()`:

1. Leia o **arquivo-fonte inteiro** (controller/service/routes) — assinaturas, erros lançados/encaminhados via `next`, validações, casos de retorno antecipado.
2. Leia 1-2 `*.test.ts` já existentes no mesmo diretório/camada para seguir as convenções reais já em uso (nomes de mocks, helpers de fixture) em vez de inventar um estilo novo.
3. Confira `vitest.config.ts` (aliases, `coverage.include/exclude`, `globals`) e se há algum helper de setup compartilhado.
4. **Enumere os cenários pelo nome antes de escrever qualquer um deles** — caminho completo, cada validação, cada branch de erro. Se você não conseguir nomear todos os cenários de validação que o controller trata, você ainda não leu o controller com atenção suficiente.
5. Se a convenção real do módulo contradisser este skill, **siga o módulo** e deixe isso explícito no PR/resumo — a convenção local sempre vence.

### Passo 1 — RED: escreva um teste que falha

1. Identifique o **comportamento** a testar (um comportamento = um teste).
2. Escreva o teste com um nome descritivo do resultado esperado.
3. Rode: `npx vitest run <arquivo> --no-watch`.
4. Confirme que falha pelo **motivo certo** (não por erro de import/sintaxe).

### Passo 2 — GREEN: implementação mínima

1. Escreva o código mais simples que faz o teste passar.
2. Rode o teste de novo — deve passar.
3. Não otimize nem refatore ainda.

### Passo 3 — REFACTOR: melhore sem mudar comportamento

1. Limpe a implementação (remova duplicação, melhore nomes).
2. Rode todos os testes do arquivo — todos devem continuar passando.
3. Se um teste quebrar durante o refactor, você mudou comportamento — reverta e tente de novo.

### Passo 4 — Repita

Escolha o próximo comportamento e comece um novo ciclo Red → Green → Refactor.

---

## Padrões de teste por camada

### A. Rota (integração, via `supertest`)

Padrão principal deste projeto — exercita Controller → Service → Route → error-handler de ponta a ponta contra a instância real de `app` (`src/app.ts`).

```ts
// src/routes/preview.routes.test.ts
import request from "supertest"
import app from "../app"

describe("POST /api/preview", () => {
    it("retorna 201 com o envelope { data } quando o body é válido", async () => {
        const response = await request(app).post("/api/preview").send({ foo: "bar" })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({ data: expect.any(Object) })
    })

    it("retorna 400 com o envelope de erro quando o body está ausente", async () => {
        const response = await request(app).post("/api/preview").send()

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ error: { code: "BAD_REQUEST" } })
    })
})
```

**Regras-chave:**

- Um `describe` por rota (método + caminho), não por controller inteiro.
- Assert no contrato HTTP (status + corpo via o envelope `{ data }`/`{ error }`), nunca em detalhe interno do service.
- `204 No Content` não tem corpo — não faça assert em `response.body` nesse caso, só em `response.status` e `response.text === ""`.
- Cenários que não são alcançáveis via roteamento HTTP real (ex.: `id` ausente numa rota `/:id` — o Express não despacha pra lá sem segmento) são testados chamando o método do controller diretamente (ver B), não via `supertest`.

### B. Controller (unidade, chamada direta ao método)

Use quando o cenário não é alcançável via HTTP real (branch de validação que o roteamento do Express torna inatingível) ou quando você quer isolar o controller do service real.

```ts
import { Request, Response, NextFunction } from "express"
import { PreviewController } from "./preview.controller"

function makeRes(): Response {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn(),
    } as unknown as Response
}

describe("PreviewController.readOne", () => {
    it("chama next com BadRequestError quando id está ausente", async () => {
        const controller = new PreviewController()
        const req = { params: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.readOne(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })
})
```

**Regras-chave:**

- Sempre `await` a chamada ao método do controller — eles são `async`.
- Assert em `next` sendo chamado com a instância certa de erro (`expect.objectContaining({ statusCode, code })`), nunca em `res.status`/`res.json` para o caminho de erro — o controller não responde erro diretamente (ver `CLAUDE.md`).
- Para o caminho de sucesso testado aqui (em vez de via `supertest`), assert em `res.status`/`res.json` sendo chamados com o envelope certo.

### C. Service (unidade, mock de dependências externas)

Hoje os services do template retornam dados mock/echo, sem I/O real. Quando um service passar a ter dependência real (banco, HTTP client), mocke a dependência, não o service:

```ts
const { queryDb } = vi.hoisted(() => ({ queryDb: vi.fn() }))
vi.mock("../db", () => ({ queryDb }))

describe("PreviewService.readOne", () => {
    it("propaga o erro quando a query falha", async () => {
        queryDb.mockRejectedValueOnce(new Error("connection lost"))

        await expect(new PreviewService().readOne("1")).rejects.toThrow("connection lost")
    })
})
```

### D. Testes parametrizados com `it.each`

Útil quando o mesmo comportamento se repete para várias entradas (ex.: vários métodos HTTP que compartilham a mesma validação de `id`/`body`):

```ts
describe.each([
    ["PUT", "update"],
    ["PATCH", "patch"],
])("%s /api/preview/:id", (verb, method) => {
    it(`retorna 400 quando body está ausente (${method})`, async () => {
        const response = await request(app)
            [verb.toLowerCase() as "put" | "patch"]("/api/preview/1")
            .send()

        expect(response.status).toBe(400)
    })
})
```

---

## Mocking Cheat Sheet

### Mockar uma função

```ts
const fn = vi.fn()
fn.mockReturnValue(42)
fn.mockResolvedValue({ id: 1 }) // async
fn.mockRejectedValue(new Error("fail")) // async com erro
fn.mockImplementation((a, b) => a + b)
```

### Espiar um método

```ts
const spy = vi.spyOn(service, "readOne")
spy.mockResolvedValue({ id: "1" })
// a implementação original continua rodando a menos que você mocke
```

### Mockar um módulo

```ts
vi.mock(import("./preview.service"), () => ({
    PreviewService: vi.fn().mockImplementation(() => ({ readOne: vi.fn() })),
}))
```

### A armadilha do hoisting

`vi.mock()` é **hoisted acima dos seus imports** — a factory roda antes de qualquer `const` de topo ser inicializada. Referenciar uma variável de topo dentro da factory lança (`Cannot access '...' before initialization`). Use `vi.hoisted()` para criar o handle na mesma fase:

```ts
const { readOne } = vi.hoisted(() => ({ readOne: vi.fn() }))
vi.mock("../services/preview.service", () => ({
    PreviewService: vi.fn().mockImplementation(() => ({ readOne })),
}))

beforeEach(() => readOne.mockReset())
```

Se a mensagem de erro menciona hoisting, **acredite nela** — use `vi.hoisted()`.

### Resetar mocks

```ts
// Em beforeEach (recomendado):
beforeEach(() => vi.clearAllMocks())

// Ou globalmente em vitest.config.ts:
test: {
    restoreMocks: true
}
```

---

## Assertion Reference (mais usados)

| Matcher                          | Uso                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| `toBe(value)`                    | Primitivos (`===`)                                                                  |
| `toEqual(value)`                 | Objetos/arrays (igualdade profunda)                                                 |
| `toMatchObject(subset)`          | Match parcial de objeto — ideal para `response.body`                                |
| `toHaveProperty('path', value?)` | Checagem de propriedade aninhada                                                    |
| `toThrow(msg?)`                  | Função lança                                                                        |
| `rejects.toThrow(msg?)`          | Promise rejeita                                                                     |
| `toBeNull()` / `toBeUndefined()` | Checagem de nulidade                                                                |
| `toHaveBeenCalledWith(args)`     | Mock chamado com args específicos                                                   |
| `toHaveBeenCalledTimes(n)`       | Contagem de chamadas do mock                                                        |
| `expect.objectContaining(obj)`   | Match assimétrico de objeto — ideal pra checar só `{ statusCode, code }` de um erro |
| `expect.any(Constructor)`        | Match assimétrico de tipo                                                           |

### Padrões específicos de `supertest`

```ts
const response = await request(app).get("/api/preview/1")

response.status // number
response.body // corpo já parseado como JSON
response.text // corpo bruto (útil pra 204, que não tem body)
```

---

## Quality Checklist (rodar antes de considerar a task concluída)

- [ ] Todo teste tem um nome descritivo do **comportamento**, não da implementação.
- [ ] Nomes de teste são curtos e escaneáveis — sem "should", sem reescrever os argumentos.
- [ ] Cada assert pode de fato falhar — para cada um, seria possível nomear a mudança de implementação que o deixaria vermelho.
- [ ] Segue Arrange → Act → Assert.
- [ ] Um comportamento por teste (sem "e" no nome do teste).
- [ ] Testes são independentes — sem estado mutável compartilhado entre eles.
- [ ] Mocks são limpos/restaurados em `beforeEach` ou via config (`restoreMocks`).
- [ ] Todo cenário de validação/erro que o controller realmente trata está coberto (não mais, não menos) — ver "Cobertura exaustiva de cenários por rota" acima.
- [ ] Testes assíncronos sempre `await`am as promises.
- [ ] Sem API do `jest.*` — só `vi.*`.
- [ ] `.test.ts` co-localizado ao lado do arquivo testado, sem `__tests__`/`.spec`.
- [ ] `npm test` (ou `npx vitest run <arquivo> --no-watch`) passa.
- [ ] Sem `.only`/`.skip` esquecido no código.

---

## Fluxo de TDD para correção de bug

1. **Escreva um teste que falha** reproduzindo o bug exato.
2. **Rode** — confirme que falha pelo motivo certo.
3. **Corrija a implementação** — mudança mínima.
4. **Rode de novo** — confirme que passa.
5. **Rode a suíte inteira** — confirme que não há regressão.

---

## Rodando os testes

```bash
npm test                    # roda toda a suíte (src/**/*.test.ts), sem gate de cobertura
npm run test:cov            # roda com cobertura; falha se qualquer métrica < 80%
npx vitest run <arquivo> --no-watch   # roda um arquivo específico, uma vez só
npx vitest                  # watch mode (desenvolvimento local)
npx vitest run -t "retorna 400" --no-watch   # roda só testes cujo nome bate com o padrão
```

> Sempre use `--no-watch`/`run` em CI ou quando rodando via agente — sem isso o comando não termina.

---

## Erros comuns a evitar

| Erro                                                                    | Correção                                                                                                  |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Usar `jest.fn()` em vez de `vi.fn()`                                    | Sempre APIs `vi.*`                                                                                        |
| Testar detalhe de implementação                                         | Teste entrada/saída e o contrato HTTP observável                                                          |
| Esquecer `await` em assert assíncrono                                   | Sempre `await expect(...).resolves/rejects`                                                               |
| Mockar demais (mockar a própria coisa sob teste)                        | Só mocke dependências, nunca o SUT                                                                        |
| Testes dependendo de ordem de execução                                  | Cada teste monta seu próprio estado                                                                       |
| `const` de topo referenciado numa factory de `vi.mock`                  | Factory é hoisted — crie o handle com `vi.hoisted()`                                                      |
| Assert em `res.status`/`res.json` para um caminho de erro do controller | O controller delega erro via `next(...)` — assert em `next`, não na resposta, quando testado isoladamente |
| Testar só o caminho feliz + "um erro genérico"                          | Cobrir cada cenário de validação/erro que o controller realmente trata (convenção deste repo)             |
| Esquecer `--no-watch`/`run` em CI/contexto de agente                    | Sempre `vitest run`                                                                                       |
| Não limpar mocks entre testes                                           | `vi.clearAllMocks()` em `beforeEach`                                                                      |

---

## Referências estendidas

Carregue estes arquivos quando a tarefa exigir mais profundidade:

| Tópico                 | Arquivo                           | Quando carregar                                                                                      |
| ---------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Auditoria de cobertura | `references/coverage-audit.md`    | Analisar gaps de cobertura, priorizar o que testar, gerar testes faltantes                           |
| Testes escritos por IA | `references/ai-authored-tests.md` | Checklist de revisão para testes que você (o agente) acabou de gerar, antes de considerá-los prontos |

**Uso:** leia o arquivo de referência relevante antes de gerar testes naquela categoria.
