// lib/prisma.ts
// Serverless-compatible Prisma client for Vercel + Neon

import { PrismaClient } from "@prisma/client"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"

// Required for Neon serverless driver in Node.js environments
neonConfig.webSocketConstructor = ws

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}