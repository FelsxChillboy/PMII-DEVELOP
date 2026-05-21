import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/upload"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"
import { ImageIcon, Trash2, Upload, AlertTriangle } from "lucide-react"
import Link from "next/link"

const PER_PAGE = 24

interface Props {
  searchParams?: Promise<{ page?: string; folder?: string }>
}

async function uploadAction(formData: FormData) {
  "use server"
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const file = formData.get("file") as File | null
  const folder = (formData.get("folder") as string) || "general"
  if (!file || file.size === 0) return

  const session = await auth()
  if (!session?.user?.id) return

  try {
    const url = await uploadImage(file, `pmii-${folder}`)
    const filename = file.name
    const mimeType = file.type
    const size = file.size

    const media = await prisma.media.create({
      data: { url, filename, mimeType, size, folder, userId: session.user.id },
    })
    await logAudit("CREATE", "MEDIA", media.id, { filename, folder })
    revalidatePath("/admin/media")
  } catch (err) {
    console.error("Media upload failed:", err)
  }
}

async function deleteAction(formData: FormData) {
  "use server"
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = formData.get("id") as string
  if (!id) return

  try {
    const media = await prisma.media.findUnique({ where: { id } })
    await prisma.media.delete({ where: { id } })
    if (media) await logAudit("DELETE", "MEDIA", id, { filename: media.filename, folder: media.folder })
    revalidatePath("/admin/media")
  } catch (err) {
    console.error("Media delete failed:", err)
  }
}

const FOLDERS = ["general", "news", "events", "gallery"]
const MIME_ICONS: Record<string, string> = {
  "image": "🖼",
  "video": "🎬",
  "application": "📄",
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function AdminMedia({ searchParams }: Props) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const folder = sp?.folder || ""

  const where = folder ? { folder } : {}

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
    prisma.media.count({ where }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Media</h1>
          <p className="text-sm text-muted-foreground">Kelola file upload</p>
        </div>
      </div>

      <form action={uploadAction} className="mb-8 p-5 rounded-xl border border-border bg-card">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1.5">Upload File Baru</label>
            <input
              type="file"
              name="file"
              accept="image/*,.pdf,.doc,.docx,.mp4"
              required
              className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Folder</label>
            <select
              name="folder"
              defaultValue="general"
              className="h-10 px-3 rounded-lg border border-border bg-background text-sm"
            >
              {FOLDERS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/admin/media"
          className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!folder ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          Semua
        </Link>
        {FOLDERS.map((f) => (
          <Link
            key={f}
            href={`/admin/media?folder=${f}`}
            className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${folder === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {f}
          </Link>
        ))}
      </div>

      <div className="text-xs text-muted-foreground mb-4">{total} file</div>

      {media.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-sm">Belum ada file.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((m) => (
          <div key={m.id} className="group relative rounded-xl border border-border bg-card overflow-hidden">
            {m.mimeType.startsWith("image/") ? (
              <div className="aspect-square bg-secondary/30">
                <img
                  src={m.url}
                  alt={m.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-secondary/30">
                <span className="text-3xl">{MIME_ICONS[m.mimeType.split("/")[0]] || "📄"}</span>
              </div>
            )}
            <div className="p-2">
              <p className="text-xs truncate">{m.filename}</p>
              <p className="text-[10px] text-muted-foreground">{formatSize(m.size)}</p>
            </div>
            <form action={deleteAction} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <input type="hidden" name="id" value={m.id} />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/media?page=${p}${folder ? `&folder=${folder}` : ""}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
