# syntax=docker/dockerfile:1
# Playground image for Fly.io. Build context is the repo root: the playground
# reads tokens/, assets/ and examples/ in place through the @ds alias.

FROM node:24.18-slim AS build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
# pnpm version comes from "packageManager" in playground/package.json
RUN corepack enable
WORKDIR /repo/playground
COPY playground/package.json playground/pnpm-lock.yaml playground/pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store
COPY tokens /repo/tokens
COPY assets /repo/assets
COPY examples /repo/examples
COPY playground /repo/playground
RUN pnpm build

# Static files only: Caddy serves dist/ behind basic auth, no Node at runtime.
FROM caddy:2.11-alpine
ENV XDG_CONFIG_HOME=/tmp/caddy/config \
    XDG_DATA_HOME=/tmp/caddy/data
COPY playground/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/playground/dist /srv
USER nobody
EXPOSE 8080
# Refuse to start without the auth secrets (a bcrypt hash, not a plaintext password),
# so a misconfigured deploy fails its health check instead of locking everyone out.
CMD ["sh", "-c", "case \"$BASIC_AUTH_HASH\" in '$2'?'$'*) ;; *) echo 'BASIC_AUTH_HASH must be a bcrypt hash (caddy hash-password)' >&2; exit 1;; esac; [ -n \"$BASIC_AUTH_USER\" ] || { echo 'BASIC_AUTH_USER is not set' >&2; exit 1; }; exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]
