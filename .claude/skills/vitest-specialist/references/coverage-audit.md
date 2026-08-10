# Auditoria de cobertura — analisando gaps e gerando testes faltantes

Fluxo sistemático para identificar código não testado em `src/`, priorizar o que cobrir, e gerar testes focados para fechar os gaps, respeitando o gate de 80% (`npm run test:cov`).

## Passo 1 — Rodar o relatório de cobertura

```bash
npm run test:cov
```

Gera relatório via provider `v8` (configurado em `vitest.config.mts`, `coverage.include: ["src/**/*.ts"]` excluindo `**/*.test.ts` e `out/`). Para HTML:

```bash
npx vitest run --coverage --reporter=html --no-watch
# abrir coverage/index.html no navegador
```

## Passo 2 — Identificar categorias de gap

| Métrica        | Significado                                           | Prioridade                                |
| -------------- | ----------------------------------------------------- | ----------------------------------------- |
| **Branches**   | Caminhos de `if`/`else`/ternário/`switch` percorridos | **Alta** — branch não testado esconde bug |
| **Statements** | Linhas executadas ao menos uma vez                    | Média                                     |
| **Functions**  | Funções chamadas ao menos uma vez                     | Média                                     |
| **Lines**      | Linhas individuais executadas                         | Baixa (geralmente espelha statements)     |

Foque em **cobertura de branch** primeiro — é o indicador mais forte de cenário esquecido, e é exatamente o que a convenção de "cobertura exaustiva de cenários por rota" deste projeto força a olhar.

## Passo 3 — Priorizar o que testar

| Prioridade       | O quê                                                                                                                                    | Por quê                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **P0 — Crítico** | `Controller`s (validação, delegação ao service, tratamento de erro via `next`)                                                           | Contrato HTTP público do recurso                               |
| **P0 — Crítico** | `Service`s com lógica de negócio real (não mock/echo)                                                                                    | Impacto direto em dado/regra de negócio                        |
| **P1 — Alto**    | `Routes` (registro correto de verbo + binding do controller)                                                                             | Já coberto na prática pelo teste de integração via `supertest` |
| **P2 — Médio**   | Middlewares (`errorHandler`, `requestLogger`)                                                                                            | Atravessam toda requisição                                     |
| **Pular**        | Tipos (`src/types/*.types.ts`), classes de erro (`src/errors/*.ts` além de checar `statusCode`/`code` uma vez), arquivos de configuração | Pouca ou nenhuma lógica em runtime                             |

## Passo 4 — Gerar testes para os gaps

Para cada arquivo não coberto:

1. Leia o arquivo-fonte para entender o contrato (assinatura, o que lança/encaminha erro, retornos antecipados).
2. Identifique cada caminho de código (branches, caminhos de erro, casos-limite).
3. Escreva um teste por caminho, seguindo a convenção deste projeto (co-localizado, `.test.ts`, um cenário por teste).
4. Rode `npm run test:cov` de novo pra confirmar que o gap fechou.

```ts
describe("<método>", () => {
    // Caminho completo
    it("retorna X quando dado Y", () => {})

    // Cada branch de validação
    it("chama next com BadRequestError quando id está ausente", () => {})
    it("chama next com BadRequestError quando body está ausente", () => {})

    // Caminho de erro do service
    it("chama next com o erro quando o service rejeita", () => {})
})
```

## Exclusões padrão deste projeto

```ts
// vitest.config.mts → test.coverage
{
    provider: "v8",
    include: ["src/**/*.ts"],
    exclude: [
        "src/**/*.test.ts",
        "src/index.ts",           // bootstrap/listen, sem lógica testável isoladamente
        "src/types/**",           // só tipos, sem runtime
    ],
    thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
}
```

Ajuste as exclusões conforme o projeto crescer — não exclua um arquivo só para "passar" no threshold; exclua porque genuinamente não há lógica de runtime para testar ali.

## Lendo a saída do terminal

```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines
----------------------|---------|----------|---------|---------|-------------------
preview.controller.ts |   85.71 |    66.67 |     100 |   85.71 | 42-48
preview.service.ts    |     100 |      100 |     100 |     100 |
----------------------|---------|----------|---------|---------|-------------------
```

- **Uncovered Lines** diz exatamente quais linhas mirar.
- **Branch < 80%** significa que existe `if`/`else` (ou validação) sem teste do caminho oposto.
- **Functions 100% mas Statements < 100%** significa que algum caminho _dentro_ de uma função chamada não foi percorrido — geralmente um branch de erro dentro de um método já exercitado pelo caminho feliz.

## Gaps comuns

| Padrão de gap                                      | Causa provável                                 | Correção                                                                  |
| -------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| `catch`/branch de erro não coberto                 | Só o caminho feliz foi testado                 | Teste com o service/mock rejeitando                                       |
| `else`/retorno antecipado de validação não coberto | Só o caso válido foi testado                   | Teste com o campo (`id`/`body`) ausente                                   |
| Branch de `switch` não coberto                     | Só um `case` foi testado                       | `it.each` cobrindo todos os `case`s                                       |
| Callback de middleware não coberto                 | Evento (`finish`, etc.) não disparado no teste | Disparar o evento explicitamente ou usar `supertest` contra uma rota real |

## Metas de cobertura por camada (guia, não regra dura)

| Camada                   | Meta de branch | Por quê                                               |
| ------------------------ | -------------- | ----------------------------------------------------- |
| Controllers              | 90%+           | Contrato HTTP público, validação crítica              |
| Services com lógica real | 90%+           | Impacto direto em dado/regra de negócio               |
| Middlewares              | 80%+           | Atravessam toda requisição                            |
| Routes (via integração)  | 70%+           | Já cobertas indiretamente pelo teste de rota completo |

O gate de CI é 80% agregado (não por arquivo) — estas metas por camada são um guia para onde investir esforço primeiro, não thresholds adicionais configurados no `vitest.config.mts`.
