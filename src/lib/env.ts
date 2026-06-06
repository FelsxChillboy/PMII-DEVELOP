function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Environment variable ${key} is required but not set`)
    }
    return val || ""
  }
  return val
}

export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  AUTH_SECRET: requireEnv("AUTH_SECRET"),
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID || "",
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET || "",
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY || "",
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY || "",
  MIDTRANS_IS_PRODUCTION: process.env.MIDTRANS_IS_PRODUCTION || "",
  REDIS_URL: process.env.REDIS_URL || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
} as const
