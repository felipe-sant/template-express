# Tasks: <nome-da-feature-ou-bug>

> Spec: `./spec.md`

## Plano de execução (opcional)

Use esta seção apenas quando houver várias tarefas com dependência entre si.
Esboce as fases e marque com `[P]` as tarefas de uma mesma fase que são
independentes entre si (não editam o mesmo arquivo, uma não depende do
resultado da outra) — o `executor` pode disparar essas em paralelo, uma
sub-agent por tarefa:

```
Fase 1 (sequencial)  →  Fase 2 (T2 [P] e T3 [P] em paralelo)  →  Fase 3
      T1                        T2 [P]    T3 [P]                    T4
```

## Tarefas

- [ ] T1 — <descrição objetiva da tarefa>
    - **Arquivo(s):** `src/...`
    - **Depende de:** nenhuma
    - **Feito quando:** critério objetivo e verificável (ex.: `npm test` passa cobrindo o cenário X em `src/routes/<recurso>.routes.test.ts`)

- [ ] T2 [P] — <descrição objetiva da tarefa>
    - **Arquivo(s):** `src/...`
    - **Depende de:** T1 <!-- remova esta linha se não houver dependência -->
    - **Feito quando:** critério objetivo e verificável

<!-- `[P]` no título marca a tarefa como paralelizável com outras `[P]` da mesma fase (ver "Plano de execução"). Omita o marcador se a tarefa for sequencial. -->

<!--
Cada tarefa deve ser pequena o suficiente para o executor marcar como concluída
sem ambiguidade. Este projeto usa vitest + supertest, com testes co-localizados
(`<arquivo>.test.ts` ao lado do arquivo testado em `src/`, nunca `__tests__/`
ou `.spec/` centralizado). Para tarefas de mudança de comportamento de código
(controller/service/route/middleware/util em `src/`), o "Feito quando" deve,
sempre que fizer sentido, referenciar o(s) arquivo(s) `.test.ts` co-localizado(s)
que cobrem o cenário (ex.: "`npm test` passa, cobrindo o cenário X em
`src/routes/<recurso>.routes.test.ts`"). Para tarefas que não mudam comportamento
de código (atualizar documentação, ajustar config, criar arquivo `.env.example`,
etc.), não é obrigatório referenciar teste — o "Feito quando" pode continuar
sendo: o build/lint passa, o comportamento foi validado manualmente, ou o
arquivo/config está no estado esperado. Use `npm run test:cov` como critério
adicional quando a tarefa precisar respeitar o gate mínimo de cobertura
(80% em lines/branches/functions/statements).
-->
