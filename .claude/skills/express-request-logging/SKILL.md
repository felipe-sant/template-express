---
name: express-request-logging
description: Como funciona o middleware de log de requisições e onde estender/adicionar campos. Use quando for tocar em src/middleware/requestLogger.middleware.ts ou nos helpers de arquivo em src/utils/.
---

# Express Request Logging

`src/middleware/requestLogger.middleware.ts` roda em toda requisição via `app.use(requestLoggerMiddleware)` em `src/app.ts`. Não é um serviço de log externo — é I/O de arquivo local, fire-and-forget.

## Como funciona hoje

1. No início da requisição, guarda o timestamp (`Date.now()`).
2. No evento `finish` da resposta, monta um objeto `{ date, method, url, status, duration }`.
3. Usa `readFile("request.log")` (de `src/utils/readFile.ts`) para ler o conteúdo atual do arquivo, concatena a nova linha em JSON e regrava o arquivo inteiro com `createFile` (de `src/utils/createFile.ts`).

## Onde adicionar um novo campo ao log

Edite o objeto `log` dentro de `createLogger` em `requestLogger.middleware.ts`. Os helpers `readFile`/`createFile` não precisam mudar — eles só leem/escrevem string.

## Ressalva conhecida

A abordagem atual de `readFile` + `createFile` reescreve o arquivo `request.log` inteiro a cada requisição, em vez de usar `appendFile`. Isso é O(n) por requisição e degrada conforme o log cresce — ver [issue #17](https://github.com/felipe-sant/template-express/issues/17). Ao tocar neste middleware, considere migrar para `fs.promises.appendFile` em vez de manter o padrão atual.
