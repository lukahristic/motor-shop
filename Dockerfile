# Dockerfile
# Multi-stage build — keeps the final image small

# ── Stage 1: Install dependencies ────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files first (Docker layer caching)
COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

# ── Stage 2: Build the app ────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js for production
RUN npm run build

# ── Stage 3: Run the app ──────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["node", "server.js"]