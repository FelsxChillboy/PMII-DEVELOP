import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import type { Prisma } from "@prisma/client"

type AuditAction = "CREATE" | "UPDATE" | "DELETE"
type AuditEntity = "NEWS" | "EVENT" | "FINANCIAL_REPORT" | "DONATION" | "USER" | "REGISTRATION" | "CONTACT" | "MEDIA"

export async function logAudit(
  action: AuditAction,
  entity: AuditEntity,
  entityId: string,
  metadata?: Record<string, unknown>
) {
  try {
    const session = await auth()
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        metadata: (metadata || {}) as Prisma.InputJsonValue,
        userId: session?.user?.id || "unknown",
      },
    })
  } catch (err) {
    console.error("Audit log failed:", err)
  }
}
