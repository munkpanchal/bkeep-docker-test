# syntax=docker/dockerfile:1.7

# -----------------------------------------------------------------------------
# Base setup with pnpm and workspace
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Enable corepack (pnpm)
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

# Install dependencies separately for better caching
FROM base AS deps
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Builder: compile TypeScript to dist
# -----------------------------------------------------------------------------
FROM base AS builder
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build server to dist
RUN pnpm run build


# -----------------------------------------------------------------------------
# Development image
# - Contains sources and dev dependencies
# -----------------------------------------------------------------------------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 8000
# Default dev command can be overridden by compose
CMD ["pnpm", "dev"]

# -----------------------------------------------------------------------------
# Production runtime image
# - Copies only built artifacts and production deps
# -----------------------------------------------------------------------------
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
# Install wget for health checks
RUN apk add --no-cache wget
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

COPY package.json pnpm-lock.yaml* ./
# Skip lifecycle scripts (e.g., husky prepare) during production install
ENV PNPM_SKIP_LIFECYCLE_SCRIPTS=true HUSKY=0
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy built files and public assets
COPY --from=builder /app/dist ./dist
COPY public ./public

# Copy migration and seed files (needed for database setup)
COPY --from=builder /app/src/database/migrations ./src/database/migrations
COPY --from=builder /app/src/database/seeds ./src/database/seeds

# Create knexfile wrapper for production migrations and seeds
# Since knexfile.ts requires TypeScript/ts-node, we create a .js wrapper
# that re-exports the compiled knexfile from dist
# This allows both db:migrate and db:seed commands to work
RUN mkdir -p src/config && \
    echo "// Production wrapper for knexfile" > src/config/knexfile.js && \
    echo "// This allows 'pnpm db:migrate' and 'pnpm db:seed' to work in production" >> src/config/knexfile.js && \
    echo "// It re-exports the compiled knexfile from dist" >> src/config/knexfile.js && \
    echo "const knexConfig = require('../../dist/config/knexfile.js').default;" >> src/config/knexfile.js && \
    echo "module.exports = knexConfig;" >> src/config/knexfile.js && \
    echo "// TypeScript wrapper that requires the .js version" > src/config/knexfile.ts && \
    echo "module.exports = require('./knexfile.js');" >> src/config/knexfile.ts && \
    chmod 644 src/config/knexfile.js src/config/knexfile.ts

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Create public directory for file uploads
RUN mkdir -p /app/public

# Expose port
EXPOSE 8000

# Default command (can be overridden in docker-compose)
# Start server with entrypoint (runs migrations and seeds first)
CMD ["/app/docker-entrypoint.sh"]


