import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { toCsv, csvResponse } from "@/lib/csv"
import { unauthorized, serverError } from "@/lib/api-response"

export async function GET() {
  const session = await auth()
  if (!session?.user) return unauthorized()
  if ((session.user as { role?: string }).role !== "ADMIN") return unauthorized()

  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    })

    const headers = ["ID", "Donatur", "Email", "HP", "Jumlah", "Status", "Tipe", "Pesan", "Tanggal"]
    const rows = donations.map((d) => ({
      ID: d.id,
      Donatur: d.donorName || d.user?.name || "Anonim",
      Email: d.donorEmail || d.user?.email || "",
      HP: d.donorPhone || "",
      Jumlah: d.amount,
      Status: d.status,
      Tipe: d.type,
      Pesan: d.message || "",
      Tanggal: d.createdAt.toISOString(),
    }))

    return csvResponse(toCsv(headers, rows), `donasi-${new Date().toISOString().slice(0, 10)}.csv`)
  } catch (err) {
    console.error("Donation export failed:", err)
    return serverError("Gagal mengekspor data")
  }
}
