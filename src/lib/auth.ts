import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"
import { checkRateLimit } from "@/lib/rate-limit"

const rateLimitStore = new Map<string, { count: number; reset: number }>()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: env.AUTH_SECRET || env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const ip = "global"
        const limit = await checkRateLimit(`auth:${credentials.email as string}:${ip}`, 5, 300_000)
        if (!limit.allowed) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    ...(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET
      ? [GitHubProvider({
          clientId: env.AUTH_GITHUB_ID,
          clientSecret: env.AUTH_GITHUB_SECRET,
        })]
      : []),
    // Google — only enabled if env vars are set
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? [GoogleProvider({
          clientId: env.AUTH_GOOGLE_ID,
          clientSecret: env.AUTH_GOOGLE_SECRET,
        })]
      : []),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub || token.id) as string
        session.user.role = (token.role as string) || "USER"
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          sub: user.id,
          id: user.id,
          role: (user as { role?: string }).role || "USER",
        }
      }
      return token
    },
  },
})
