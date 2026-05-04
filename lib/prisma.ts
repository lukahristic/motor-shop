// lib/prisma.ts
// Prisma Client singleton — one shared instance across the whole app.
// In development, Next.js hot-reloads modules which would create
// multiple DB connections. This pattern prevents that.

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}