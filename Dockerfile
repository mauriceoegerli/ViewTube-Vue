FROM node:22-bookworm AS build
WORKDIR /home/build

ENV CI=true

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY server/package.json ./server/
COPY shared/package.json ./shared/
COPY client/package.json ./client/
COPY client/scripts ./client/scripts
COPY patches ./patches

RUN npm install -g pnpm@9.10.0

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

RUN rm -rf node_modules client/node_modules server/node_modules shared/node_modules "$(pnpm store path)"

RUN CI=true pnpm --filter=./server --filter=./client install --frozen-lockfile --prod

FROM node:22-bookworm-slim AS runtime
WORKDIR /home/app

ENV NODE_ENV=production

COPY --from=build /home/build/package.json ./
COPY --from=build /home/build/client/package.json ./client/
COPY --from=build /home/build/server/package.json ./server/
COPY --from=build /home/build/shared/package.json ./shared/

COPY --from=build /home/build/node_modules ./node_modules
COPY --from=build /home/build/server/node_modules ./server/node_modules

COPY --from=build /home/build/server/dist ./server/dist/

COPY --from=build /home/build/shared/dist ./shared/dist/

COPY --from=build /home/build/client/.output ./client/.output/

RUN \
  --mount=type=cache,target=/var/cache/apt \
  apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && rm -rf /var/cache/apt/archives /var/lib/apt/lists/*

ENV VIEWTUBE_BASE_DIR=/home/app
HEALTHCHECK --interval=30s --timeout=20s --start-period=60s --retries=5 CMD curl --fail http://localhost:8066/ || exit 1
EXPOSE 8066

CMD ["node", "/home/app/server/dist/main.js"]
