/**
 * Prisma Client Singleton
 * Ensures a single instance of PrismaClient is used throughout the application
 */

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["warn"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
