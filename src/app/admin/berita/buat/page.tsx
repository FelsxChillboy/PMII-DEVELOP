import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireAdmin } from "@/lib/server/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function BuatBeritaPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) redirect("/admin")

  async function create(formData: FormData) {
    "use server"
    const { session, error: authErr } = await requireAdmin()
    if (authErr || !session) return

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const content = formData.get("content") as string
    const published = formData.get("published") === "on"

    if (!title || !slug || !content) return

    try {
      await prisma.news.create({
        data: {
          title,
          slug,
          content,
          published,
          authorId: session.user.id!,
        },
      })
    } catch (err) {
      console.error("Create news failed:", err)
      return
    }

    revalidatePath("/admin/berita")
    redirect("/admin/berita")
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
            Buat Berita
          </h1>
          <p className="text-sm text-muted-foreground">
            Publikasikan berita dan informasi baru
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form action={create} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1.5">
              Judul
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Judul berita"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="judul-berita-dalam-url"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Gunakan huruf kecil, tanpa spasi, tanda hubung sebagai pemisah
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1.5">
              Konten
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={16}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y font-mono"
              placeholder="Tulis konten berita di sini... (bisa pakai HTML)"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              className="h-4 w-4 rounded border-border bg-secondary text-primary focus:ring-primary/50"
            />
            <span className="text-sm">Publikasikan langsung</span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Simpan
            </button>
            <Link
              href="/admin/berita"
              className="h-11 px-6 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors inline-flex items-center"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
