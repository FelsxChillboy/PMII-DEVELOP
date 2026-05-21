import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { unauthorized, serverError } from "@/lib/api-response"

export async function GET() {
  const session = await auth()
  if (!session?.user) return unauthorized()

  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) return unauthorized()

  try {
    const [pendingDonations, unreadContacts] = await Promise.all([
      prisma.donation.count({ where: { status: "PENDING" } }),
      prisma.contact.count({ where: { read: false } }),
    ])

    return Response.json({ pendingDonations, unreadContacts })
  } catch (err) {
    console.error("Notification counts failed:", err)
    return serverError("Gagal memuat notifikasi")
  }
}
