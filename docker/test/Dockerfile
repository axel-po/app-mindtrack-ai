FROM node:24-alpine3.21

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --include=dev

COPY . .

CMD ["pnpm", "run", "test:run"]
