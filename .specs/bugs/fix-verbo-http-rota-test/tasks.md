# Tasks: fix-verbo-http-rota-test

- [x] T1 — Trocar o verbo HTTP da rota `/_` de `propfind` para `get`
  - Arquivo(s): `src/routes/__test__.routes.ts`
  - Feito quando: a chamada `this.router.propfind(this.url_test, this.testController.__test__.bind(this.testController))` é substituída por `this.router.get(this.url_test, this.testController.__test__.bind(this.testController))`, e o comentário `` `GET | http://0.0.0.0:0000/api/test/_` `` imediatamente acima permanece inalterado (não é necessário editar texto).

- [x] T2 — Validar build e lint
  - Arquivo(s): nenhum (apenas validação)
  - Feito quando: `npm run build` e `npm run lint` executam sem erros novos após a alteração de T1.

- [x] T3 — Validar comportamento em runtime
  - Arquivo(s): nenhum (apenas validação manual)
  - Feito quando: com o servidor rodando (`npm run dev`), uma requisição `GET http://localhost:3000/api/test/_` (ou porta configurada) retorna status `200`.
