import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { toCsv, csvResponse } from "@/lib/csv"
import { unauthorized, serverError } from "@/lib/api-response"

export async function GET() {
  const session = await auth()
  if (!session?.user) return unauthorized()
  if ((session.user as { role?: string }).role !== "ADMIN") return unauthorized()

  try {
    const reports = await prisma.financialReport.findMany({
      orderBy: { date: "desc" },
    })

    const headers = ["ID", "Judul", "Tipe", "Kategori", "Jumlah", "Tanggal", "Deskripsi"]
    const rows = reports.map((r) => ({
      ID: r.id,
      Judul: r.title,
      Tipe: r.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
      Kategori: r.category,
      Jumlah: r.type === "INCOME" ? r.amount : -r.amount,
      Tanggal: r.date.toISOString().slice(0, 10),
      Deskripsi: r.description || "",
    }))

    return csvResponse(toCsv(headers, rows), `keuangan-${new Date().toISOString().slice(0, 10)}.csv`)
  } catch (err) {
    console.error("Financial export failed:", err)
    return serverError("Gagal mengekspor data")
  }
}
