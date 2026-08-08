FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm ci

COPY src ./src

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/out ./out

COPY package.json package-lock.json ./

# Remover caso não tenha o .env
COPY .env ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "out/index.js"]