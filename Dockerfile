FROM node:22-slim

RUN apt-get update && apt-get install -y make

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY Makefile package.json pnpm-lock.yaml ./

RUN pnpm config set store-dir /home/node/.local/share/pnpm/store
RUN make install

RUN mkdir -p /app/src
