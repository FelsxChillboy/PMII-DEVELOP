import type { PrismaConfig } from "prisma"
import "dotenv/config"

export default {
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "",
  },
} satisfies PrismaConfig
