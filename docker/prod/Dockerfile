FROM node:24-alpine3.21 AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:24-alpine3.21 

WORKDIR /app

RUN npm install -g pnpm

ARG BETTER_AUTH_SECRET
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET


COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]