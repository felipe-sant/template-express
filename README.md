# Template Express + TypeScript

Boilerplate/template para APIs REST com Express e TypeScript, seguindo o padrão Controller → Service → Route por recurso.

## Estrutura

```
src/
├── app.ts                      # instância do Express, middlewares e registro de rotas
├── index.ts                    # ponto de entrada, sobe o servidor na porta 3000
├── controllers/                # camada de controllers (parseia request, delega ao service)
├── routes/                     # camada de rotas (Router do Express por recurso)
├── services/                   # camada de regra de negócio
├── middleware/                 # middlewares do Express (ex.: log de requisições)
└── utils/                      # funções auxiliares (leitura/escrita de arquivo, etc.)
```

O módulo `__test__` (`__test__.controller.ts`, `__test__.routes.ts`, `__test__.service.ts`) não é uma suíte de testes — é um scaffold de referência que demonstra o padrão a ser seguido para novos recursos. Não há framework de testes configurado neste projeto.

## Como criar um novo recurso

1. Copie o trio `__test__.controller.ts`, `__test__.routes.ts` e `__test__.service.ts`.
2. Renomeie os arquivos e as classes para o novo recurso.
3. Implemente a lógica de negócio real no service.
4. Registre o novo router em `src/app.ts`, acima do catch-all `app.use("/", ...)`:
    ```ts
    app.use("/api/<recurso>", <recurso>Routes)
    ```

## Comandos

| Comando                    | Descrição                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`              | Sobe o servidor de desenvolvimento com nodemon + ts-node, com hot reload (`src/**/*.ts`) |
| `npm run build`            | Faz a checagem de tipos e compila `src` para `out/`                                      |
| `npm start`                | Builda (via `prestart`) e roda o build de produção compilado                             |
| `npm run lint`             | Roda o ESLint no projeto                                                                 |
| `npm run create-image`     | Builda a imagem Docker (`docker build -t image .`)                                       |
| `npm run create-container` | Roda o container Docker, mapeando a porta 3001 do host para a 3000 do container          |

## Variáveis de ambiente

O `.env` é carregado via `dotenv`. Use o `.env.example` como referência para criar o seu.

## Deploy

- **Docker**: build em dois estágios — compila com `tsc` e depois copia `out/` e `.env` para uma imagem de produção mais leve (veja o `Dockerfile`).
- **Vercel**: o `vercel.json` builda `src/index.ts` diretamente com `@vercel/node`, roteando todas as requisições para ele — esse fluxo não passa pelo build/pasta `out` usado pelo Docker/`npm start`.

## Log de requisições

O middleware `requestLoggerMiddleware` registra cada requisição (data, método, url, status e duração) em um arquivo local `request.log`, ao final da resposta.
