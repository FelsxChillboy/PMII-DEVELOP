import { prisma } from "@/lib/prisma"
import { success, error, notFound, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/server/auth"
import { FinancialReportSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return authErr

  const { id } = await params

  try {
    const body = await request.json()
    const parsed = FinancialReportSchema.safeParse(body)
    if (!parsed.success) return error(parsed.error.issues[0].message)

    const report = await prisma.financialReport.update({
      where: { id },
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        amount: parsed.data.amount,
        category: parsed.data.category,
        date: new Date(parsed.data.date),
      },
    })

    revalidatePath("/transparansi")
    revalidatePath("/admin/keuangan")

    return success({
      ...report,
      date: report.date.toISOString().split("T")[0],
    })
  } catch (err) {
    if ((err as any)?.code === "P2025") return notFound("Laporan tidak ditemukan")
    console.error("Update financial report failed:", err)
    return serverError("Gagal mengupdate laporan keuangan")
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return authErr

  const { id } = await params

  try {
    await prisma.financialReport.delete({ where: { id } })

    revalidatePath("/transparansi")
    revalidatePath("/admin/keuangan")

    return success({ message: "Laporan berhasil dihapus" })
  } catch (err) {
    if ((err as any)?.code === "P2025") return notFound("Laporan tidak ditemukan")
    console.error("Delete financial report failed:", err)
    return serverError("Gagal menghapus laporan keuangan")
  }
}
