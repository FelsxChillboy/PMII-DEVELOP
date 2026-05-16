import { auth } from "@/lib/auth"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  if ((session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Forbidden")
  }
  return session
}

export async function requireUser() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }
  return session
}
