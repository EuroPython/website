FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

RUN pnpm config set store-dir /home/node/.local/share/pnpm/store

WORKDIR /app
