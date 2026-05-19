import { auth } from "@/lib/auth"
import { unauthorized, error } from "@/lib/api-response"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    return { session: null, error: unauthorized("Unauthorized") }
  }
  if ((session.user as { role?: string }).role !== "ADMIN") {
    return { session: null, error: error("Forbidden", 403) }
  }
  return { session, error: null }
}

export async function requireUser() {
  const session = await auth()
  if (!session?.user?.id) {
    return { session: null, error: unauthorized("Unauthorized") }
  }
  return { session, error: null }
}
