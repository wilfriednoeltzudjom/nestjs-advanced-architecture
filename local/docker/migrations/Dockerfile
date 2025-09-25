FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update && apk upgrade && apk add --no-cache bash curl
RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./package.json ./pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "db:migration", "up"]