import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { updateNews } from "@/lib/admin-actions"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBeritaPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) redirect("/admin")

  const { id } = await params
  const news = await prisma.news.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      content: true,
      published: true,
    },
  })
  if (!news) notFound()

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
            Edit Berita
          </h1>
          <p className="text-sm text-muted-foreground">{news.title}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form action={updateNews} className="space-y-6">
          <input type="hidden" name="id" value={news.id} />

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1.5">
              Judul
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={news.title}
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
              defaultValue={news.slug}
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-1.5">
              Gambar (URL)
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="text"
              defaultValue={news.imageUrl || ""}
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="/uploads/news/12345-abc.jpg atau https://..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload gambar lewat API atau masukkan URL gambar eksternal
            </p>
            {news.imageUrl && (
              <div className="mt-2">
                <Image src={news.imageUrl} alt="" width={160} height={80} className="h-20 w-auto rounded-lg object-cover border border-border" unoptimized />
              </div>
            )}
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
              defaultValue={news.content}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y font-mono"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={news.published}
              className="h-4 w-4 rounded border-border bg-secondary text-primary focus:ring-primary/50"
            />
            <span className="text-sm">Publikasikan</span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Simpan Perubahan
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
