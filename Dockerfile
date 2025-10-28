FROM node:24

RUN npm i -g bun
WORKDIR /app

RUN apt install curl bash

COPY bun.lock package.json ./

RUN bun install --frozen-lockfile
COPY . .
ENV DATABASE_URL="postgresql://devops:devops@db:5432/devopsdb?schema=public"
RUN bun x prisma generate
RUN bun run build

EXPOSE 3000
CMD ["/bin/bash", "-c", "bun x prisma migrate deploy && bun run start"]
