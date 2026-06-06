import { success, error, unauthorized, serverError } from "@/lib/api-response"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/upload"
import { rateLimitMiddleware } from "@/lib/rate-limit"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export async function POST(request: Request) {
  const rateLimitResponse = await rateLimitMiddleware("upload", 10, 60_000)
  if (rateLimitResponse) return rateLimitResponse

  const session = await auth()
  if (!session?.user) return unauthorized()

  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) return error("Forbidden", 403)

  try {
    const contentLength = request.headers.get("content-length")
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return error("Payload terlalu besar", 413)
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return error("File tidak ditemukan")

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return error("Format file tidak didukung. Gunakan: jpg, jpeg, png, gif, webp")
    }

    if (file.size > 5 * 1024 * 1024) return error("Ukuran file maksimal 5MB")

    const url = await uploadImage(file, "pmii-news")
    return success({ url }, 201)
  } catch (err) {
    console.error("Upload failed:", err)
    return serverError("Gagal mengupload file")
  }
}
