import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireAdmin } from "@/lib/server/auth"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import { Plus, ExternalLink, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

const PER_PAGE = 20

async function getNews(page: number) {
  try {
    const [news, total] = await Promise.all([
      prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
        take: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
      }),
      prisma.news.count(),
    ])
    return { news, total }
  } catch {
    return null
  }
}

async function deleteAction(formData: FormData) {
  "use server"
  const { session, error: authErr } = await requireAdmin()
  if (authErr || !session) return
  const id = formData.get("id") as string
  if (!id) return
  try {
    await prisma.news.delete({ where: { id } })
    revalidatePath("/admin/berita")
  } catch (err) {
    console.error("Delete news failed:", err)
  }
}

export default async function AdminBerita(props: { searchParams?: Promise<{ page?: string }> }) {
  const sp = await props.searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const data = await getNews(page)
  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
            Berita
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola berita dan publikasi
          </p>
        </div>
        <Link
          href="/admin/berita/buat"
          className="inline-flex h-9 px-4 items-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Buat Berita
        </Link>
      </div>

      {!data && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-500 mb-6">
          Database tidak terhubung.
        </div>
      )}

      {data && (
        <div className="mb-4 text-xs text-muted-foreground">
          {data.total} berita &middot; Halaman {page} dari {totalPages}
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Judul</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Penulis</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Tanggal</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.news.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Belum ada berita. Klik &quot;Buat Berita&quot; untuk memulai.
                  </td>
                </tr>
              )}
              {data?.news.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <p className="font-medium truncate max-w-xs">{item.title}</p>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {item.author.name || "-"}
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${item.published ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                      {item.published ? "Terbit" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">
                    {item.createdAt.toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/berita/${item.id}`} className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                        Edit <ExternalLink className="h-3 w-3" />
                      </Link>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-xs transition-colors">
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link
            href={`/admin/berita?page=${page - 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page <= 1 ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
            aria-disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/berita?page=${p}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`/admin/berita?page=${page + 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
            aria-disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
