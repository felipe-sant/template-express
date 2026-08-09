# Testes escritos por IA — checklist de revisão antes de considerar prontos

Adaptado do guia oficial do Vitest ["Writing Tests with AI"](https://vitest.dev/guide/learn/writing-tests-with-ai.html), reformulado para o agente que **escreve** o teste (não para o humano que pede um). Carregue este arquivo depois de gerar um lote de `*.test.ts` e antes de marcar a tarefa como concluída.

## Contexto a carregar antes do primeiro `it()`

1. O arquivo-fonte **inteiro** — assinaturas, erros encaminhados via `next`, retornos antecipados, defaults.
2. 1-2 `*.test.ts` já existentes na mesma camada, para casar com as convenções reais (nomes de helpers de mock, estilo de fixture) em vez de inventar um estilo novo.
3. `vitest.config.mts` (aliases, `coverage.include/exclude`, `globals`).
4. Assinaturas de tipo das dependências mockadas (`Request`/`Response`/`NextFunction` do Express, o service real) — um mock com o shape errado passa no teste e mente sobre o comportamento real.

Regra: se a convenção real do módulo contradisser este skill, **siga o módulo** — e diga isso explicitamente no resumo da tarefa.

## Enumeração de cenários antes de escrever

Antes de escrever qualquer `it()`, liste os cenários pelo nome. Um objetivo fraco é "testar o endpoint de update". Um objetivo forte é a lista completa de branches que o controller realmente trata: `id` ausente, `body` ausente/vazio, caminho completo, e (se aplicável) o service rejeitando.

Heurística: se você não consegue nomear todo cenário de validação/erro que o controller trata, você ainda não leu o controller com atenção suficiente — volte ao Passo 0 do `SKILL.md` antes de escrever o primeiro teste.

## Rubrica de revisão (rodar depois de gerar os testes, antes de finalizar)

1. **Todo assert pode de fato falhar.** Para cada `expect(...)`, nomeie a mudança de implementação que o deixaria vermelho. `expect(result).toBeDefined()` sozinho quase nunca sobrevive a essa pergunta.
2. **Comportamento, não implementação.** Refatorar o corpo de um método sem mudar seu contrato observável (entrada → saída, ou entrada → chamada a `next` com o erro certo) não deveria quebrar o teste. Ressalva: para chamadas a dependências externas (o service que o controller chama, ou um HTTP client que um service futuro venha a usar), a própria chamada com os argumentos certos **é** o contrato — nesse caso, assert em como a dependência foi chamada é esperado, não um vazamento de implementação.
3. **Rode de fato o arquivo antes de dizer que passa.** `npx vitest run <arquivo> --no-watch` — nunca declare "os testes passam" sem ter rodado o comando e visto o resultado.
4. **Casos-limite reais, não só o exemplo óbvio.** Além do happy path e do "campo ausente" genérico: string vazia vs. `undefined` (`req.body = {}` vs. `req.body` ausente — o controller trata os dois igual? confirme lendo o código, não assuma), o service retornando um valor falsy legítimo (`0`, `""`, `[]`) que não deveria ser confundido com "erro"/"não encontrado".

## Nomes de teste curtos

IA tende a escrever nomes de teste longos demais, reafirmando os argumentos em vez de descrever o comportamento.

| Ruim                                                                                               | Bom                                              |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `should correctly return 400 when the id parameter is not provided in the request`                 | `retorna 400 quando id está ausente`             |
| `should call next with the error when the service throws an exception during the update operation` | `chama next com o erro quando o service rejeita` |
| `test that the response contains the correct data envelope structure`                              | `responde com o envelope { data }`               |

## Armadilhas comuns de teste gerado por IA

| Armadilha                                                                                    | Por que acontece                                                                                                            | Correção                                                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Usar `jest.*` em vez de `vi.*`                                                               | Modelo treinado majoritariamente em exemplos com Jest                                                                       | Sempre `vi.fn()`/`vi.mock()`/`vi.spyOn()`                                                                                                                                                                               |
| Vazamento de mock entre testes                                                               | Esquecer `vi.clearAllMocks()`/`restoreMocks`                                                                                | `beforeEach(() => vi.clearAllMocks())`                                                                                                                                                                                  |
| `vi.mock("./caminho/string")` quando um import de tipo já existia                            | Perde type-safety da factory                                                                                                | Preferir `vi.mock(import("./caminho"), ...)` quando possível                                                                                                                                                            |
| Deixar o comando em watch mode                                                               | Gerado sem `--no-watch`/`run`                                                                                               | Sempre `vitest run <arquivo> --no-watch`                                                                                                                                                                                |
| Import fantasma (referencia um símbolo que não existe no arquivo real)                       | Modelo "lembra" de uma API parecida de outro projeto                                                                        | Confirme cada import contra o arquivo-fonte real antes de rodar                                                                                                                                                         |
| Assert no formato de erro sem passar pelo middleware                                         | Assumir o shape de `{ error: { code, message } }` dentro de um teste que só chama o controller isolado (sem `errorHandler`) | Ao testar o controller isolado, assert em `next` ter sido chamado com a instância certa de erro — o envelope `{ error }` só existe depois do `errorHandler`, que só roda de fato num teste via `supertest` contra `app` |
| Testar um cenário que o controller não implementa (ex.: validação de `query` que não existe) | Generalizar demais a partir de outro projeto/exemplo                                                                        | Cobrir só os cenários que o código real trata — nem mais, nem menos                                                                                                                                                     |

## O ciclo: rascunho → rodar → revisar → reescrever → rodar de novo

1. **Rascunho** — escreva o lote de testes para os cenários enumerados.
2. **Rodar** — `npx vitest run <arquivo> --no-watch`; confirme que cada um falha/passa pelo motivo esperado (rode contra a implementação atual antes de qualquer mudança, se for TDD).
3. **Revisar** — aplique a rubrica acima; risque qualquer assert que não sobreviva à pergunta "isso pode falhar?".
4. **Reescrever** — corrija nomes, remova asserts fracos, adicione cenário que faltou.
5. **Rodar de novo** — confirme que o arquivo final passa (`npm test`) e que `npm run test:cov` não caiu abaixo de 80%.

Não considere a tarefa concluída até fechar esse ciclo pelo menos uma vez.
