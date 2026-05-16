import { PrismaClient } from "@prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const url = (process.env.DATABASE_URL || "").replace("mysql://", "mariadb://")
const adapter = new PrismaMariaDb(url)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : undefined,
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
