import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { success, error, unauthorized, notFound, serverError } from "@/lib/api-response"
import { z } from "zod"

const UpdateDonationSchema = z.object({
  status: z.enum(["PENDING", "SUCCESS", "FAILED"]),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return unauthorized()
  }

  const { id } = await params

  try {
    const body = await request.json()
    const parsed = UpdateDonationSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const donation = await prisma.donation.findUnique({ where: { id } })
    if (!donation) return notFound("Donasi tidak ditemukan")

    const updated = await prisma.donation.update({
      where: { id },
      data: { status: parsed.data.status },
      select: {
        id: true,
        amount: true,
        status: true,
        donorName: true,
        paymentUrl: true,
        updatedAt: true,
      },
    })

    return success(updated)
  } catch (err) {
    console.error("Update donation status failed:", err)
    return serverError("Gagal memperbarui status donasi")
  }
}
