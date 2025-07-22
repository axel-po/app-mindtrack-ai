FROM node:24-alpine3.21

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --include=dev

COPY . .

RUN npx eslint . --ext .js,.ts

CMD ["pnpm", "run", "test:run"]
