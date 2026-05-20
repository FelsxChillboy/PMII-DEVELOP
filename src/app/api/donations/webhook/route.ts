import { prisma } from "@/lib/prisma"
import { success, error, serverError } from "@/lib/api-response"
import { verifyWebhookNotification, getTransactionStatus } from "@/lib/payment"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const orderId = body.order_id as string

    if (!orderId) {
      return error("Missing order_id", 400)
    }

    const verified = verifyWebhookNotification(body)
    if (!verified) {
      return error("Invalid signature", 403)
    }

    const status = await getTransactionStatus(orderId)
    const dbStatus = status.status === "SUCCESS" ? "SUCCESS" : status.status === "FAILED" ? "FAILED" : "PENDING"

    await prisma.donation.updateMany({
      where: { transactionId: orderId },
      data: { status: dbStatus },
    })

    return success({ message: "OK" })
  } catch (err) {
    console.error("Webhook processing failed:", err)
    return serverError("Gagal memproses notifikasi")
  }
}
