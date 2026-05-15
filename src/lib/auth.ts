import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID || process.env.GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = (token.role as string) || "USER"
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          role: (user as { role?: string }).role || "USER",
        }
      }
      return token
    },
  },
})
