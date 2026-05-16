const REQUIRED: string[] = []

const MISSING = REQUIRED.filter((key) => !process.env[key])

if (MISSING.length > 0) {
  throw new Error(
    `Missing required environment variables:\n${MISSING.map((k) => `  - ${k}`).join("\n")}\n\nSee .env.example for reference.`
  )
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  AUTH_SECRET: process.env.AUTH_SECRET || "",
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID || "",
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET || "",
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
} as const
