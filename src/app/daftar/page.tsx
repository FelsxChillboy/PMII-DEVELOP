import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { registerUser } from "@/lib/actions"
import { Mail, Lock, User, AlertCircle } from "lucide-react"
import { env } from "@/lib/env"

export const metadata: Metadata = {
  title: "Daftar Akun",
  description: "Daftar akun baru PR PMII Rayon Teknik UNUSIA Jakarta Pusat.",
}

async function registerAction(formData: FormData) {
  "use server"
  const result = await registerUser(formData)
  if (result.error) {
    redirect(`/daftar?error=${result.error}`)
  }
  redirect("/login?registered=1")
}

async function githubRegisterAction() {
  "use server"
  try {
    const { signIn } = await import("@/lib/auth")
    await signIn("github")
  } catch (error) {
    const digest = (error as { digest?: string })?.digest
    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    redirect("/daftar?error=OAuthSignin")
  }
}

async function googleRegisterAction() {
  "use server"
  try {
    const { signIn } = await import("@/lib/auth")
    await signIn("google")
  } catch (error) {
    const digest = (error as { digest?: string })?.digest
    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    redirect("/daftar?error=OAuthSignin")
  }
}

export default async function DaftarPage(props: {
  searchParams?: Promise<{ error?: string }>
}) {
  const session = await auth()
  if (session?.user) {
    const role = (session.user as { role?: string }).role
    redirect(role === "ADMIN" ? "/admin" : "/dashboard")
  }

  const searchParams = await props.searchParams
  const error = searchParams?.error

  const githubEnabled = !!(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET)
  const googleEnabled = !!(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET)
  const oauthAvailable = githubEnabled || googleEnabled

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-heading text-2xl font-bold text-white mb-2">
            Daftar Akun
          </h1>
          <p className="text-sm text-gray-400">
            Bergabung dengan PR PMII Rayon Teknik
          </p>
        </div>

        {error === "email_exists" && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            Email sudah terdaftar
          </div>
        )}

        {(error === "OAuthSignin" || error === "OAuthCallback" || error === "OAuthCreateAccount") && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            Gagal daftar dengan akun eksternal. Silakan coba lagi.
          </div>
        )}

        <form
          action={registerAction}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="sr-only">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Nama Lengkap"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="Password (min. 6 karakter)"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">Konfirmasi Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="Konfirmasi Password"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Daftar
          </button>
        </form>

        {oauthAvailable && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#0F172A] text-gray-500">atau</span>
              </div>
            </div>

            <div className="space-y-3">
              {githubEnabled && (
                <form
                  action={githubRegisterAction}
                >
                  <button
                    type="submit"
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-white text-gray-900 font-medium text-sm hover:bg-gray-100 transition-colors"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/>
                    </svg>
                    Daftar dengan GitHub
                  </button>
                </form>
              )}

              {googleEnabled && (
                <form
                  action={googleRegisterAction}
                >
                  <button
                    type="submit"
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-white text-gray-900 font-medium text-sm hover:bg-gray-100 transition-colors"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Daftar dengan Google
                  </button>
                </form>
              )}
            </div>
          </>
        )}

        <p className="mt-8 text-center text-xs text-gray-500">
          Sudah punya akun?{" "}
          <a href="/login" className="text-primary hover:underline">
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  )
}
