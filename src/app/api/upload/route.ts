import { success, error, unauthorized, serverError } from "@/lib/api-response"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return unauthorized()

  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) return error("Forbidden", 403)

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return error("File tidak ditemukan")

    const ext = path.extname(file.name).toLowerCase()
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    if (!allowed.includes(ext)) return error("Format file tidak didukung. Gunakan: jpg, jpeg, png, gif, webp, svg")

    if (file.size > 5 * 1024 * 1024) return error("Ukuran file maksimal 5MB")

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const dir = path.join(process.cwd(), "public", "uploads", "news")
    await mkdir(dir, { recursive: true })
    const filepath = path.join(dir, filename)
    await writeFile(filepath, buffer)

    const url = `/uploads/news/${filename}`

    return success({ url }, 201)
  } catch (err) {
    console.error("Upload failed:", err)
    return serverError("Gagal mengupload file")
  }
}
